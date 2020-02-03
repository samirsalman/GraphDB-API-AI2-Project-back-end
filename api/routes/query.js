/*Connect the server to the IA2 repository on GraphDB*/
const { ServerClient, ServerClientConfig } = require("graphdb").server;
const {
  RepositoryClientConfig,
  GetStatementsPayload
} = require("graphdb").repository;
const { SparqlXmlResultParser } = require("graphdb").parser;
const { RDFMimeType } = require("graphdb").http;
const {
  GetQueryPayload,
  QueryType,
  QueryLanguage,
  QueryPayload
} = require("graphdb").query;
const fs = require("fs");
const axios = require("axios");

const QueryDocument = require("../models/queryDocument");
const QueryStrings = require("../models/queryStrings");
const express = require("express");
const router = express.Router();
const { trc } = require("graphdb").transaction;

var QueryStringsConst = new QueryStrings();
var results = [];
var hashResult = new Map();
const readTimeout = 30000;
const writeTimeout = 30000;
const config = new ServerClientConfig("http://localhost:7200/", 0, {});
const server = new ServerClient(config);
const repositoryClientConfig = new RepositoryClientConfig(
  ["http://localhost:7200/repositories/IA2Project"],
  {},
  "",
  readTimeout,
  writeTimeout
);

/*FUNZIONI AUSILIARIE*/
/*Metodo che ci connette al repository IA2 su GraphDB*/
var rdfRepositoryClient;
server.getRepository("IA2Project", repositoryClientConfig).then(rep => {
  console.log("REPOSITORY GET");

  rdfRepositoryClient = rep;
  rdfRepositoryClient.registerParser(new SparqlXmlResultParser());
});

/*Funzione che, data una query in input (la query già scritta in linguaggio SPARQL) crea il payload della richiesta http da inviare */
function createSelectQuery(query) {
  return new GetQueryPayload()
    .setQuery(query)
    .setQueryType(QueryType.SELECT)
    .setResponseType(RDFMimeType.SPARQL_RESULTS_XML);
}

/*Funzione che svuota l'array dei risultati per ospitarne di nuovi*/
function clearDataStructures() {
  results = [];
  hashResult.clear();
}

/* Metodo che permette di connettersi al repository da qualsiasi dominio esterno/*/
var query = router.get("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/*This function create an object of type QueryDocument using the result obtained from the SPARQL query to GraphDB*/
function createResults(bindings) {
  var t = new QueryDocument(
    bindings.book,
    bindings.title != null
      ? bindings.title.value.replace(new RegExp("[{,}]", "g"), "")
      : "",
    bindings.year != null ? bindings.year.value : "",
    bindings.name != null ? bindings.name.value.replace(",", " ") : "",
    bindings.isbn != null ? bindings.isbn.value : "",
    bindings.issn != null ? bindings.issn.value : "",
    bindings.edit != null ? bindings.edit.value : "",
    bindings.journ != null ? bindings.journ.value : "",
    bindings.pub != null ? bindings.pub.value : "",
    bindings.booktitle != null ? bindings.booktitle.value : "",
    bindings.type
  );
  if (hashResult.get(t.uri.id) !== undefined) {
    console.log(t.uri.id);
    hashResult.get(t.uri.id).authors = (
      hashResult.get(t.uri.id).authors +
      ", " +
      t.authors.replace(",", " ")
    )
      .replace(/{\\"u}/g, "ü")
      .replace(/\\'{e}/g, "é")
      .replace(/{\\"u}/g, "ö");
  } else {
    hashResult.set(t.uri.id, t);
  }
}



/*METODI*/
/*Metodo da eseguire quando riceviamo una richiesta GET all'indirizzo /query/all */
var query = router.get("/all", (req, res, next) => {
  console.log("GET ALL RECEIVED");
  console.log(req.query);
  clearDataStructures();

  query = QueryStringsConst.allQuery(
    req.query.orderBy,
    req.query.year,
    req.query.type
  );

  const payload = createSelectQuery(query).setLimit(40);

  rdfRepositoryClient.query(payload).then(stream => {
    stream.on("data", bindings => {
      createResults(bindings);
    });
    stream.on("end", () => {
      Array.from(hashResult.keys()).map(e => {
        results.push(hashResult.get(e));
      });
      res.status(200).json(results);
    });
  });
});



/*Metodo da eseguire quando riceviamo una richiesta GET all'indirizzo /query/download con parametro uri */
router.get("/download/:uri", (req, res, next) => {
  console.log("DW RECEIVED");
  console.log(req.params.uri);
  const header = {
    Accept: "application/rdf+xml",
    "X-GraphDB-Repository": "IA2Project"
  };

  axios.default
    .get(
      `http://localhost:7200/rest/explore/graph?uri=${req.params.uri}&role=subject&inference=explicit&bnodes=true&sameAs=true`,
      { headers: header, responseType: "stream" }
    )
    .then(result => {
      var file = fs.createWriteStream(__dirname + "/my.rdf");
      var r = result.data.pipe(file);
      r.on("finish", () => {
        file.close();
        res.download(`${__dirname}/my.rdf`, "result.rdf");
      });
    })
    .catch(err => res.sendStatus(500).send(err));
});



/*Metodo da eseguire quando riceviamo una richiesta GET all'indirizzo /query/searchByTitle con parametro name */
router.get("/searchByTitle/:name", (req, res, next) => {
  console.log("GET BY TITLE RECEIVED");
  console.log(req.query);
  clearDataStructures();

  var query = QueryStringsConst.searchByTitleQuery(
    req.params.name,
    req.query.orderBy,
    req.query.year,
    req.query.type
  );

  const payload = createSelectQuery(query).setLimit(40);
  rdfRepositoryClient.query(payload).then(stream => {
    stream.on("data", bindings => {
      console.log(bindings);
      createResults(bindings);
    });
    stream.on("end", () => {
      Array.from(hashResult.keys()).map(e => {
        results.push(hashResult.get(e));
      });
      res.status(200).json(results);
    });
  });
});



/*Metodo da eseguire quando riceviamo una richiesta GET all'indirizzo /query/searchByIsbn con parametro isbn */
router.get("/searchByIsbn/:isbn", (req, res, next) => {
  console.log("GET BY ISBN RECEIVED");
  console.log(req.query);
  clearDataStructures();

  query = QueryStringsConst.searchByISBNQuery(
    req.params.isbn,
    req.query.orderBy,
    req.query.year,
    req.query.type
  );

  const payload = createSelectQuery(query).setLimit(40);
  rdfRepositoryClient.query(payload).then(stream => {
    stream.on("data", bindings => {
      createResults(bindings);
    });
    stream.on("end", () => {
      Array.from(hashResult.keys()).map(e => {
        results.push(hashResult.get(e));
      });
      res.status(200).json(results);
    });
  });
});



/*Metodo da eseguire quando riceviamo una richiesta GET all'indirizzo /query/searchByAuthor con parametro author */
router.get("/searchByAuthor/:author", (req, res, next) => {
  console.log("GET BY AUTHOR RECEIVED");
  console.log(req.query);
  clearDataStructures();

  query = QueryStringsConst.searchByAuthorQuery(
    req.params.author,
    req.query.orderBy,
    req.query.year,
    req.query.type
  );

  const payload = createSelectQuery(query).setLimit(40);
  rdfRepositoryClient.query(payload).then(stream => {
    stream.on("data", bindings => {
      console.log(bindings);

      createResults(bindings);
    });
    stream.on("end", () => {
      Array.from(hashResult.keys()).map(e => {
        results.push(hashResult.get(e));
      });
      res.status(200).json(results);
    });
  });
});



/*Metodo da eseguire quando riceviamo una richiesta GET all'indirizzo /query/searchRelated con parametro title */
router.get("/searchRelated/:title", (req, res, next) => {
  console.log("GET BY RELATED RECEIVED");
  console.log(req.query);
  clearDataStructures();
  console.log(decodeURI(req.params.title));

  query = QueryStringsConst.searchRelated(
    decodeURIComponent(req.params.title),
    req.query.uri
  );

  const payload = createSelectQuery(query).setLimit(10);
  rdfRepositoryClient.query(payload).then(stream => {
    stream.on("data", bindings => {
      console.log(bindings);
      createResults(bindings);
    });
    stream.on("end", () => {
      Array.from(hashResult.keys()).map(e => {
        results.push(hashResult.get(e));
      });
      res.status(200).json(results);
    });
  });
});



/*Metodo da eseguire quando riceviamo una richiesta GET all'indirizzo /query/numberOf/book*/
router.get("/numberOf/book", (req, res, next) => {
  console.log("GET BY RELATED RECEIVED");
  clearDataStructures();
  console.log(decodeURI(req.params.title));

  query = QueryStringsConst.getNumbersOfBook();

  const payload = createSelectQuery(query);
  rdfRepositoryClient.query(payload).then(stream => {
    var x = 0;
    stream.on("data", bindings => {
      console.log(bindings);
      x = bindings.sumBook.value;
    });
    stream.on("end", () => {
      res.status(200).json(x);
    });
  });
});



/*Metodo da eseguire quando riceviamo una richiesta GET all'indirizzo /query/numberOf/article*/
router.get("/numberOf/article", (req, res, next) => {
  console.log("GET BY RELATED RECEIVED");
  console.log(req.query);
  clearDataStructures();
  console.log(decodeURI(req.params.title));

  query = QueryStringsConst.getNumbersOfArticle();
  const payload = createSelectQuery(query);
  rdfRepositoryClient.query(payload).then(stream => {
    var x = 0;
    stream.on("data", bindings => {
      console.log(bindings);
      x = bindings.sumBook.value;
    });
    stream.on("end", () => {
      res.status(200).json(x);
    });
  });
});



/*Metodo da eseguire quando riceviamo una richiesta GET all'indirizzo /query/numberOf/inproceedings*/
router.get("/numberOf/inproceedings", (req, res, next) => {
  console.log("GET BY RELATED RECEIVED");
  console.log(req.query);
  clearDataStructures();
  console.log(decodeURI(req.params.title));

  query = QueryStringsConst.getNumbersOfInProceedings();

  const payload = createSelectQuery(query);
  rdfRepositoryClient.query(payload).then(stream => {
    var x = 0;
    stream.on("data", bindings => {
      console.log(bindings);
      x = bindings.sumBook.value;
    });
    stream.on("end", () => {
      res.status(200).json(x);
    });
  });
});

module.exports = router;

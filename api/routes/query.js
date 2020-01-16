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
const QueryDocument = require("../models/queryDocument");
const QueryStrings = require("../models/queryStrings");
const express = require("express");
const router = express.Router();

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

var rdfRepositoryClient;
server.getRepository("IA2Project", repositoryClientConfig).then(rep => {
  rdfRepositoryClient = rep;
  rdfRepositoryClient.registerParser(new SparqlXmlResultParser());
});

function createSelectQuery(query) {
  return new GetQueryPayload()
    .setQuery(query)
    .setQueryType(QueryType.SELECT)
    .setResponseType(RDFMimeType.SPARQL_RESULTS_XML);
}

function clearDataStructures() {
  results = [];
  hashResult.clear();
}

var query = router.get("/all", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var query = router.get("/searchByTitle/:name", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var query = router.get("/searchByAuthor/:author", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var query = router.get("/searchByIsbn/:isbn", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

function createResults(bindings) {
  var t = new QueryDocument(
    bindings.book,
    bindings.title.value.replace(new RegExp("[{,}]", "g"), ""),
    bindings.year != null ? bindings.year.value : "",
    bindings.name != null ? bindings.name.value.replace(",", " ") : "",
    bindings.isbn.value
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

var query = router.get("/all", (req, res, next) => {
  clearDataStructures();
  query = QueryStringsConst.allQuery;
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

router.get("/searchByTitle/:name", (req, res, next) => {
  clearDataStructures();

  var query = `PREFIX bibo: <http://purl.org/ontology/bibo/>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX dc0: <http://purl.org/dc/terms/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  
  select ?book ?title ?name ?year ?isbn where { 
    ?book  a   bibo:Document .
      ?book bibo:isbn ?isbn .
      ?book dc:title ?title .
      
      OPTIONAL{
      ?book dc:date ?year .
      ?book dc0:creator ?authors .
      ?authors foaf:name ?name .
      }
      FILTER regex(?title, "${req.params.name}", "i").
  }`;

  const payload = createSelectQuery(query);

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

router.get("/searchByIsbn/:isbn", (req, res, next) => {
  clearDataStructures();

  query = `PREFIX bibo: <http://purl.org/ontology/bibo/>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX dc0: <http://purl.org/dc/terms/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  
  select ?book ?title ?name ?year ?isbn where { 
    ?book  a   bibo:Document .
      ?book bibo:isbn ?isbn .
      ?book dc:title ?title .
      
      OPTIONAL{
      ?book dc:date ?year .
      ?book dc0:creator ?authors .
      ?authors foaf:name ?name .
      }
      FILTER regex(?isbn, "${req.params.isbn}", "i").
  }`;

  const payload = createSelectQuery(query);

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

router.get("/searchByAuthor/:author", (req, res, next) => {
  clearDataStructures();

  query = `PREFIX bibo: <http://purl.org/ontology/bibo/>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX dc0: <http://purl.org/dc/terms/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  
  select ?book ?title ?name ?year ?isbn where { 
    ?book  a   bibo:Document .
      ?book bibo:isbn ?isbn .
      ?book dc:title ?title .
      
      OPTIONAL{
      ?book dc:date ?year .
      ?book dc0:creator ?authors .
      ?authors foaf:name ?name .
      }
      FILTER regex(?name, "${req.params.author}", "i").
  }`;

  const payload = createSelectQuery(query);

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

module.exports = router;

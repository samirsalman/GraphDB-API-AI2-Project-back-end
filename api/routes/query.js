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
  console.log("REPOSITORY GET");

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

var query = router.get("/*", (req, res, next) => {
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
    bindings.isbn != null ? bindings.isbn.value : ""
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
  console.log("GET ALL RECEIVED");

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

router.get("/searchByTitle/:name/:orderBy?", (req, res, next) => {
  console.log("GET BY TITLE RECEIVED");
  console.log(req.params);

  clearDataStructures();

  var query = QueryStringsConst.searchByTitleQuery(
    req.params.name,
    req.params.orderBy
  );

  const payload = createSelectQuery(query);

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

router.get("/searchByIsbn/:isbn/:orderBy?", (req, res, next) => {
  clearDataStructures();
  console.log("GET BY ISBN RECEIVED");

  query = QueryStringsConst.searchByISBNQuery(
    req.params.isbn,
    req.params.orderBy
  );

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

router.get("/searchByAuthor/:author/:orderBy?", (req, res, next) => {
  clearDataStructures();
  console.log("GET BY AUTHOR RECEIVED");

  query = QueryStringsConst.searchByAuthorQuery(
    req.params.author,
    req.params.orderBy
  );

  const payload = createSelectQuery(query);

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

module.exports = router;

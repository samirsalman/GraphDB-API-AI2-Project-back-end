const { ServerClient, ServerClientConfig } = require("graphdb").server;
const {
  RepositoryClientConfig,
  GetStatementsPayload
} = require("graphdb").repository;
const md5Hash = require("blueimp-md5");

const { SparqlXmlResultParser } = require("graphdb").parser;
const { QueryContentType } = require("graphdb").http;
const { UpdateQueryPayload } = require("graphdb").query;
const QueryDocument = require("../models/queryDocument");
const QueryStrings = require("../models/queryStrings");
const express = require("express");
const router = express.Router();

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

const insertQuery = require("../models/insertStrings");

const InsertQuery = new insertQuery();

var rdfRepositoryClient;
server.getRepository("IA2Project", repositoryClientConfig).then(rep => {
  console.log("REPOSITORY GET");

  rdfRepositoryClient = rep;
  rdfRepositoryClient.registerParser(new SparqlXmlResultParser());
});

var query = router.post("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept"
  );
  res.header("Content-Type", "application/json");
  next();
});

async function insertAllAuthors(authorsArray) {
  for (var i = 0; i < authorsArray.length; i++) {
    console.log(authorsArray[i]);

    var payload = createInsertQuery(
      InsertQuery.insertAuthor(authorsArray[i].name, authorsArray[i].authUri)
    );
    await rdfRepositoryClient.update(payload);
  }
  return true;
}

function createInsertQuery(query) {
  return new UpdateQueryPayload()
    .setQuery(query)
    .setContentType(QueryContentType.X_WWW_FORM_URLENCODED)
    .setInference(true)
    .setTimeout(5);
}

var query = router.post("/book", async (req, res, next) => {
  var authorsArray = [];
  req.body.authors.map(el => {
    var uri = md5Hash(Math.random() * 66464654649494949797979464566);
    authorsArray.push({
      name: el,
      authUri: uri
    });
  });

  insertAllAuthors(authorsArray)
    .then(response => {
      const payload = createInsertQuery(
        InsertQuery.insertBook(
          req.body.title,
          authorsArray,
          req.body.pub,
          req.body.year,
          req.body.isbn
        )
      );
      rdfRepositoryClient.update(payload).then(() => {
        res.status(200).json(req.body.authors);
      });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;

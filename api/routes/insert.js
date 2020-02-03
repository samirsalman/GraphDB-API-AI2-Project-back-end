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
const InsertStrings = require("../models/insertStrings");
const express = require("express");
const router = express.Router();

var InsertStringsConst = new InsertStrings();
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

/*FUNZIONI AUSILIARIE*/
/*Metodo che ci connette al repository IA2 su GraphDB*/
var rdfRepositoryClient;
server.getRepository("IA2Project", repositoryClientConfig).then(rep => {
  console.log("REPOSITORY GET");

  rdfRepositoryClient = rep;
  rdfRepositoryClient.registerParser(new SparqlXmlResultParser());
});

/* Metodo che permette di connettersi al repository da qualsiasi dominio esterno/*/
var query = router.post("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept"
  );
  res.header("Content-Type", "application/json");
  next();
});

/*Funzione asincrona che dato un array di coppie (nomeAutore, uriAutore) crea nell'ontologia ogni autore dell'array*/
async function insertAllAuthors(authorsArray) {
  for (var i = 0; i < authorsArray.length; i++) {
    console.log(authorsArray[i]);
    var query = InsertStringsConst.insertAuthorQuery(
      authorsArray[i].name,
      authorsArray[i].authUri
    );
    /*Ogni coppia dell'array la passiamo come coppi di parametri al metodo 
      updateBookQuery (definito UpdateStringsConst ovvero nel file updateStrings.js ) 
      che ci crea la query sparql e ce la restituisce*/
    var payload = createInsertQuery(query);
    await rdfRepositoryClient.update(payload);
  }
  return true;
}

/*Funzione che, data una query in input (la query già scritta in linguaggio SPARQL) crea il payload della richiesta http da inviare */
function createInsertQuery(query) {
  return new UpdateQueryPayload()
    .setQuery(query)
    .setContentType(QueryContentType.X_WWW_FORM_URLENCODED)
    .setInference(true)
    .setTimeout(5);
}



/*METODI*/
/*Metodo da eseguire quando riceviamo una richiesta POST all'indirizzo /insert/book */
var query = router.post("/book", async (req, res, next) => {
  var authorsArray = [];

  /*Creiamo una coppia (nomeautore, uriAutore) per ogni autore presente nel body della POST ricevuta*/
  req.body.authors.map(el => {
    var uri = md5Hash(Math.random() * 66464654649494949797979464566);
    authorsArray.push({ name: el, authUri: uri });
  });

  /*Chiamiamo la funzione che ci crea gli autori*/
  insertAllAuthors(authorsArray).then(response => {
    var query = InsertStringsConst.insertBookQuery(
      req.body.title,
      authorsArray,
      req.body.publisher,
      req.body.year,
      req.body.isbn
    );
    const payload = createInsertQuery(query);

    rdfRepositoryClient.update(payload).then(() => {
      res.status(200).json({ response: "Success" })
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ response: "Error" })
  });
});



/*Insert of an article (only after we had inserted its authors)*/
router.post("/article", async (req, res, next) => {
  var authorsArray = [];
  req.body.authors.map(el => {
    var uri = md5Hash(Math.random() * 66464654649494949797979464566);
    authorsArray.push({ name: el, authUri: uri });
  });

  insertAllAuthors(authorsArray).then(response => {
    var query = InsertStringsConst.insertArticleQuery(
      req.body.title,
      authorsArray,
      req.body.year,
      req.body.issn,
      req.body.journal
    );
    const payload = createInsertQuery(query);
    rdfRepositoryClient.update(payload).then(() => {
      res.status(200).json({
        response: "Success"
      })
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ response: "Error" })
  });
});



/*Insert of an inProceeding (only after we had inserted its authors)*/
router.post("/inProceedings", async (req, res, next) => {
  var authorsArray = [];
  req.body.authors.map(el => {
    var uri = md5Hash(Math.random() * 66464654649494949797979464566);
    authorsArray.push({
      name: el,
      authUri: uri
    });
  });

  insertAllAuthors(authorsArray).then(response => {
    var query = InsertStringsConst.insertInProceedingsQuery(
      req.body.title,
      authorsArray,
      req.body.publisher,
      req.body.year,
      req.body.isbn,
      req.body.bookTitle,
      req.body.editor
    );

    const payload = createInsertQuery(query);
    rdfRepositoryClient.update(payload).then(() => {
      res.status(200).json({
        response: "Success"
      })
    });
  })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        response: "Error"
      })
    });
});

module.exports = router;

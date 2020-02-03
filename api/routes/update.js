const { ServerClient, ServerClientConfig } = require("graphdb").server;
const {
    RepositoryClientConfig,

    GetStatementsPayload
} = require("graphdb").repository;

const { SparqlXmlResultParser } = require("graphdb").parser;
const { QueryContentType } = require("graphdb").http;
const {
    QueryType,
    UpdateQueryPayload,
    QueryLanguage,
    QueryPayload
} = require("graphdb").query;
const QueryDocument = require("../models/queryDocument");
const UpdateStrings = require("../models/updateStrings");
const express = require("express");
const router = express.Router();

var UpdateStringsConst = new UpdateStrings();
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

/* Metodo che permette di connettersi al repository da qualsiasi dominio esterno/*/
var query = router.put("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

/*Funzione che, data una query in input (la query già scritta in linguaggio SPARQL) crea il payload della richiesta http da inviare */
function createUpdateQuery(query) {
    return new UpdateQueryPayload()
        .setQuery(query)
        .setContentType(QueryContentType.X_WWW_FORM_URLENCODED)
        .setInference(true)
        .setTimeout(5);
}

/*Funzione che svuota l'array dei risultati per ospitarne di nuovi*/
function clearDataStructures() {
    results = [];
    hashResult.clear();
}



/*METODI*/
/*Metodo da eseguire quando riceviamo una richiesta POST all'indirizzo /update/book */
var query = router.put("/book", (req, res, next) => {
    clearDataStructures();
    console.log(req.body.isbn);

    /*I dati ricevuti nel body della post li passiamo come parametri al metodo 
      updateBookQuery (definito UpdateStringsConst ovvero nel file updateStrings.js ) 
      che ci crea la query sparql e ce la restituisce*/
    var query = UpdateStringsConst.updateBookQuery(
        req.body.uri,
        req.body.publisher,
        req.body.isbn
    );

    /*Ora che abbiamo la query sparql la scriviamo nel payload della http request*/
    const payload = createUpdateQuery(query);
    rdfRepositoryClient.update(payload).then(() => {
        res.status(200).json({
            response: "Success"
        })
    }).catch((error) => {
        res.status(500).json({
            response: "Error"
        })
    });
});



/*Metodo da eseguire quando riceviamo una richiesta POST all'indirizzo /update/article */
var query = router.put("/article", (req, res, next) => {
    clearDataStructures();

    /*I dati ricevuti nel body della post li passiamo come parametri al metodo 
      updateArticleQuery (definito UpdateStringsConst ovvero nel file updateStrings.js ) 
      che ci crea la query sparql e ce la restituisce*/
    var query = UpdateStringsConst.updateArticleQuery(
        req.body.uri,
        req.body.journal,
        req.body.issn
    );

    /*Ora che abbiamo la query sparql la scriviamo nel payload della http request*/
    const payload = createUpdateQuery(query);

    rdfRepositoryClient.update(payload).then(() => {
        res.status(200).json({
            response: "Success"
        })
    }).catch((error) => {
        res.status(500).json({
            response: "Error"
        })
    });
});



/*Metodo da eseguire quando riceviamo una richiesta POST all'indirizzo /update/inProceedings */
var query = router.put("/inProceedings", (req, res, next) => {
    clearDataStructures();

    /*I dati ricevuti nel body della post li passiamo come parametri al metodo 
      updateInProceedingsQuery (definito UpdateStringsConst ovvero nel file updateStrings.js ) 
      che ci crea la query sparql e ce la restituisce*/
    var query = UpdateStringsConst.updateInProceedingsQuery(
        req.body.uri,
        req.body.bookTitle,
        req.body.isbn,
        req.body.publisher,
        req.body.editor
    );

    /*Ora che abbiamo la query sparql la scriviamo nel payload della http request*/
    const payload = createUpdateQuery(query);

    rdfRepositoryClient.update(payload).then(() => {
        res.status(200).json({
            response: "Success"
        })
    }).catch((error) => {
        res.status(500).json({
            response: "Error"
        })
    });
});

module.exports = router;
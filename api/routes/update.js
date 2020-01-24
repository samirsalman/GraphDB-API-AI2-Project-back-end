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

var rdfRepositoryClient;
server.getRepository("IA2Project", repositoryClientConfig).then(rep => {
    console.log("REPOSITORY GET");

    rdfRepositoryClient = rep;
    rdfRepositoryClient.registerParser(new SparqlXmlResultParser());
});

function createUpdateQuery(query) {
    return new UpdateQueryPayload()
        .setQuery(query)
        .setContentType(QueryContentType.X_WWW_FORM_URLENCODED)
        .setInference(true)
        .setTimeout(5);
}

function clearDataStructures() {
    results = [];
    hashResult.clear();
}

var query = router.put("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

/*Update isbn and/or publisher of a book*/
var query = router.put("/book", (req, res, next) => {
    clearDataStructures();
    console.log(req.body.isbn);

    var query = UpdateStringsConst.updateBookQuery(
        req.body.uri,
        req.body.publisher,
        req.body.isbn
    );

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



/*Update issn  and/or journalTitle of an Article*/
var query = router.put("/article", (req, res, next) => {
    clearDataStructures();

    var query = UpdateStringsConst.updateArticleQuery(
        req.body.uri,
        req.body.journal,
        req.body.issn
    );

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



/*Update isbn and/or publisher and/or editor and/or bookTitle of an inProceeding*/
var query = router.put("/inProceedings", (req, res, next) => {
    clearDataStructures();

    var query = UpdateStringsConst.updateInProceedingsQuery(
        req.body.uri,
        req.body.bookTitle,
        req.body.isbn,
        req.body.publisher,
        req.body.editor
    );

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
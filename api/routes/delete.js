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
const DeleteStrings = require("../models/deleteStrings");
const express = require("express");
const router = express.Router();

var DeleteStringsConst = new DeleteStrings();
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

function createDeleteQuery(query) {
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

var query = router.delete("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

var query = router.delete("/:uri", (req, res, next) => {
    clearDataStructures();

    var query = DeleteStringsConst.deleteQuery(
        req.params.uri
    );

    const payload = createDeleteQuery(query);

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
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const queryRoutes = require("./api/routes/query");

app.use("/query", queryRoutes);

module.exports = app;

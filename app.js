const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors());
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const queryRoutes = require("./api/routes/query");
const deleteRoutes = require("./api/routes/delete");

const insertRoutes = require("./api/routes/insert");

app.use("/insert", insertRoutes);
app.use("/query", queryRoutes);
app.use("/delete", deleteRoutes);

module.exports = app;

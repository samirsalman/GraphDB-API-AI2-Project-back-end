//Let's include the module to work with HTTP
const http = require("http");

//Let's include the module to work with the FILESYSTEM
const fs = require("fs");

//Let's include the module to create quicky our  server
const express = require("express");
const app = express();

//define the port on which the server will listen
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`I'm listening on port : `, PORT);
});

//Let's define the basic route to access to our server
app.get("/", (req, res, next) => {
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  fs.readFile("home.html", function (err, html) {
    if (err) {
      console.log("ERROR");

      throw err;
    }
    console.log("HTML");

    res.write(html);
    res.end();
  });
});

//include this module and use it to autogenerate documentation for our server (app)
const Docs = require("express-api-doc");
const docs = new Docs(app);

/*Let's include the module that enable the backend to receive and send http request
not simple (example http request with json in the body)*/
var cors = require("cors");
app.use(cors());

/*Let's include the module that enable the backend to parse the json received in the
body of the http request*/
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*Let's define the other routes to access to our server*/
const queryRoutes = require("./api/routes/query");
app.use("/query", queryRoutes);

const deleteRoutes = require("./api/routes/delete");
app.use("/delete", deleteRoutes);

const insertRoutes = require("./api/routes/insert");
app.use("/insert", insertRoutes);

const updateRoutes = require("./api/routes/update");
app.use("/update", updateRoutes);
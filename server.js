const http = require("http");

const app = require("./app");
const Docs = require("express-api-doc");

const docs = new Docs(app);
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT);

app.get("/", (req, res, next) => {
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  fs.readFile("home.html", function(err, html) {
    if (err) {
      console.log("ERROR");

      throw err;
    }
    console.log("HTML");

    res.write(html);
    res.end();
  });
});

console.log(`I'm listening on port : `, PORT);

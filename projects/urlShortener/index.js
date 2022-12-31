require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dns = require("dns");
const urlparser = require("url");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// connect to database
mongoose.connect("<password>", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(mongoose.connection.readyState);

const schema = new mongoose.Schema({ url: "string" });
const Url = new mongoose.model("Url", schema);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.post("/api/shorturl", function (req, res) {
  const bodyurl = req.body.url;
  const dnsLook = dns.lookup(
    urlparser.parse(bodyurl).hostname,
    (error, address) => {
      if (!address) {
        res.json({ error: "Invalid URL" });
      } else {
        const url = new Url({ url: bodyurl });
        url.save((err, data) => {
          res.json({ original_url: data.url, short_url: data.id });
        });
      }
    }
  );
});

app.get("/api/shorturl/:id", function (req, res) {
  const id = req.params.id;
  Url.findById(id, (err, data) => {
    if (!data) {
      res.json({ error: "Invalid URL" });
    } else {
      res.redirect(data.url);
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

const express = require("express");
const path = require("path");
const app = express();

// set up a public folder
app.use(express.static("./public"));

app.listen(5000, () => {
  console.log("server is listening o port 5000");
});

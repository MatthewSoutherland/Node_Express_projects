const express = require("express");
const app = express();

// set up a public folder
app.use(express.static("./public"));

app.get("./home", (req, res) => {
  res.send("Task manager app");
  res.end();
});

const port = 3000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});

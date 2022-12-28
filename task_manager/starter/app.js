const express = require("express");
const app = express();

// set up a public folder
app.use(express.static("./public"));

const port = 3000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});

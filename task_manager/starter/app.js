const express = require("express");
const app = express();

// set up a public folder
app.use(express.static("./public"));

app.get("./home", (req, res) => {
  res.send("Task manager app");
});

// app.get('/api/v1/tasks')         -get all the tasks
// app.post('/api/v1/tasks')        -create a new task
// app.get('/api/v1/tasks/:id')     -get single task
// app.patch('/api/v1/tasks/:id')   -update task
// app.delete('/api/v1/tasks/:id')  -delete task

const port = 3000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});

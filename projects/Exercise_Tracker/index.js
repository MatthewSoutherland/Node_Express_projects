const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const app = express();

// connect to database
mongoose.connect(
  "mongodb+srv://matt:<password>@cluster313.wzs703q.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const personSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
});

const exerciseSchema = new Schema({
  userId: String,
  description: String,
  duration: Number,
  date: Date,
});

const Person = mongoose.model("Person", personSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

console.log(mongoose.connection.readyState);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// comes with project
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  let newPerson = new Person({ username: req.body.username });
  newPerson.save((err, data) => {
    if (err) {
      res.send("Username already exists");
    } else {
      res.json({ Username: data.username, _id: data.id });
    }
  });
});

app.post("/api/users/:_id/exercises", (req, res) => {
  // destructor req.body methods
  let { userId, description, duration, date } = req.body;
  if (!date) {
    date = new Date();
  }
  Person.findById(userId, (err, data) => {
    if (!data) {
      res.send("Unknown userId");
    } else {
      const username = data.username;
      let newExercise = new Exercise({ userId, description, duration, date });
      newExercise.save((err, data) => {
        res.json({
          username,
          description,
          duration: +duration,
          _id: userId,
          date: new Date(date).toDateString(),
        });
      });
    }
  });
});

app.get("/api/users/:_id/logs?", (req, res) => {
  // destructor req.query methods
  const { userId, from, to, limit } = req.query;
  console.log(`userId: ${req.query.userId} from: ${req.query.from}`);

  Person.findById(userId, (err, data) => {
    console.log(`Person.findById data: ${data}`);
    if (!data) {
      res.send("Unknown userId");
    } else {
      const username = data.username;

      Exercise.find(
        { userId },
        { date: { $gte: new Date(from), $lte: new Date(to) } }
      )
        .select(["id", "description", "duration", "date"])
        .limit(+limit)
        .exec((err, data) => {
          let customdata = data.map(exer => {
            let dataFormatted = new Date(exer.date).toDateString;
            return {
              id: exer.id,
              description: exer.description,
              duration: exer.duration,
              date: dateFormatted,
            };
          }); // closing data.map
          console.log(`customdata: ${customdata}`);
          if (!data) {
            res.json({
              userId: userId,
              username: username,
              count: 0,
              log: [],
            });
          } else {
            res.json({
              userId: userId,
              username: username,
              count: data.length,
              log: customdata,
            });
          } // closing else
        }); // closing exec( (err, data))
    } // closing else
  }); // closing Person.findById
}); // closing off app.get()

app.get("/api/users", (req, res) => {
  Person.find({}, (err, data) => {
    if (!data) {
      res.send("No users");
    } else {
      res.send(data);
    }
  });
});

// tests
//https://boilerplate-project-exercisetracker.matthewsoutherl.repl.co/api/users/:_id/logs

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

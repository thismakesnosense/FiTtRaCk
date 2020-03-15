const express = require("express");
const path = require("path");
let mongoose = require("mongoose");
const app = express();
const Port = process.env.PORT || 3000
const Workout = require("./models").Workout;
const mongojs = require("mongojs");
const databaseUrl = "Workout";
const collections = ["workouts"];

const db = mongojs(databaseUrl, collections);
mongoose.connect("mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});
app.use(express.static("public"));

app.get("/exercise", function(req, res){

   res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.get("/stats", function(req, res){

  res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.get("/api/workouts/range", async function(req, res) {
 await db.workouts.find({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});

app.get("/api/workouts", async function(req, res){
  let workouts = await Workout.find();
  res.json(workouts);
});



app.post("/api/workouts", function(req, res){
    
    Workout.create({}, function(err, collection){
      if (err){
        throw new Error
        
      }
      res.json(collection);
    });
    
    
});

app.put("/api/workouts/:id", async function(req, res){
  let workout = await Workout.findOne({_id: req.params.id});
  
  
    workout.exercise.push(req.body);
    Workout.where({_id: workout._id}).update(workout);
    res.json(workout);
  
});



app.listen(Port, ()=> {
    console.log("app is listening on port");
});
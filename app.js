// imprort app requirements
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose =require('mongoose')

// importing routes
const UserRoutes = require("./Api/routes/user");


// stting up mongoose connect 
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect("mongodb://localhost:27017/InkAroma", options)
  .then((connect) => {
    console.log("=> Connect to database successfully!");
  })
  .catch((error) => {
    console.log("=> Connect to database with errors!");
    console.log(error);
  });
////////////////////// middleware treatement //////////////////////////

// setting up morgan pachage
app.use(morgan("dev"));
// config bodyparser
app.use(
  express.json({
    extended: true,
  })
);
// CORS handlying
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Origin",
    "OriginnX-requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "PATCH",
      "GET",
      "DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

// routes that handls requests
app.use("/", UserRoutes);

// handlying all wrong routes  :

app.use((req, res, next) => {
  const error = new Error("Not Found !");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;

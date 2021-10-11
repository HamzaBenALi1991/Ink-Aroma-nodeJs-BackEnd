// imprort app requirements
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose =require('mongoose')
const cors =require("cors")
// bearer strategie  with passport 
require('./passport/bearerStrategie')
// dotenv config 
require('dotenv').config()




// importing routes
const UserRoutes = require("./Api/routes/user");
const BookRoutes =require('./Api/routes/book');
const ReviewRoutes =require('./Api/routes/review')
const UploadRoutes =require('./Api/routes/fileApi')
const forgetpass = require('./Api/routes/forgetpasswordApi')


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
app.use(cors());

// making uploads public 
app.use( "/uploads", express.static("uploads"));

// routes that handls requests
app.use("/", UserRoutes);
app.use('/',BookRoutes); 
app.use('/',ReviewRoutes) ;
app.use('/', UploadRoutes)
app.use('/', forgetpass)

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

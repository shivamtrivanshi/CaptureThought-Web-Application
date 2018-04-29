var express = require("express");
var ejs = require("ejs");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");


//load user model
var User = require("./models/User");

//Passport config
require("./config/passport")(passport);

//load routes
var indexRoute = require("./routes/index");
var authRoute = require("./routes/auth");

//load keys
var keys = require("./config/keys");

//Map global promises
mongoose.Promise = global.Promise;
//Mongoose connect
mongoose.connect(keys.mongoURI, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("mongoDB connected..");
    } 
});

var app = express();


//EJS MIDDLEWARE
app.set("view engine", "ejs");

//express-session middleware
app.use(cookieParser());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global vars
app.use(function(req, res, next){
    res.locals.user = req.user || null;
    next();
});





//Use Route
app.use(indexRoute);
app.use(authRoute);


var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Server started on port: "+port);
});
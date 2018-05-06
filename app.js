var express = require("express");
var path = require("path");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");


//load Models
var User = require("./models/User");
var Story = require("./models/Stories");

//Passport config
require("./config/passport")(passport);

//load routes
var indexRoute = require("./routes/index");
var authRoute = require("./routes/auth");
var storiesRoute = require("./routes/stories");

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

//MOMENT MIDDLEWARE
app.locals.moment = require("moment");

//BODY-PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//METHOD-OVERRIDE MIDDLEWARE
app.use(methodOverride("_method"));

//EJS MIDDLEWARE
app.set("view engine", "ejs");

//SANITIZER MIDDLEWARE
app.use(expressSanitizer());

//FLASH MIDDELWARE
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//set public folder
app.use(express.static(path.join(__dirname, "public")));





//Use Route
app.use(indexRoute);
app.use(authRoute);
app.use(storiesRoute);


app.get("*", function(req, res){
    req.flash("error", "oops!! Page not found");
    res.render("index/notfound");
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Server started on port: "+port);
});
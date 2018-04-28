var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var app = express();

//Passport config
require("./config/passport")(passport);

//load routes
var authRoute = require("./routes/auth");

app.get("/", function(req, res){
    res.send("welcome");
});

//Use Route
app.use(authRoute);

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Server started on port: "+port);
});
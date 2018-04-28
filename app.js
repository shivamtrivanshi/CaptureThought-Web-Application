var express = require("express");
var mongoose = require("mongoose");
var app = express();

app.get("/", function(req, res){
    res.send("welcome");
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Server started on port: "+port);
});
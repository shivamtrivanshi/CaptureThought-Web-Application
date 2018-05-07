var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Story = mongoose.model("stories");
var {ensureAuthenticated, ensureGuest} = require("../halper/auth");

//index route
router.get("/", ensureGuest, function(req, res){
    res.render("index/welcome");
});

router.get("/dashboard", ensureAuthenticated, function(req, res){
    Story.find({user: req.user.id}).sort({date: "desc"}).exec(function(err, stories){
        if(err){
            req.flash("error", "Connection error!");
            res.redirect("/");
        }else{
            res.render("index/dashboard", {stories: stories});
        }
    });
   
});

router.get("/about", function(req, res){
    res.render("index/about");
});

module.exports = router;
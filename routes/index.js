var express = require("express");
var router = express.Router();

//index route
router.get("/", function(req, res){
    res.render("index/welcome");
});

router.get("/dashboard", function(req, res){
    res.send("dashboard");
});

module.exports = router;
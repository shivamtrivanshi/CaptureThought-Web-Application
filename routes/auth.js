var express = require("express");
var router = express.Router();
var passport = require("passport");

router.get("/auth/google", passport.authenticate("google",
{scope: ["profile", "email"]}));


router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
    // Successful authentication, redirect dashboard.
        res.redirect('/dashboard');
});

router.get("/auth/verify", function(req, res){
    if(req.user){
        console.log(req.user);
    }else{
        console.log("not auth");
    }
});

router.get("/auth/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;
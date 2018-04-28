var GoogleStrategy = require("passport-google-oauth20").Strategy;
var mongoose = require("mongoose");
var keys = require("./keys");


module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            proxy: true
        }, function(accessToken, refreshToken, profile, done){
            console.log(accessToken);
            console.log(profile);
        })
    )
}
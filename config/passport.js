var GoogleStrategy = require("passport-google-oauth20").Strategy;
var mongoose = require("mongoose");
var keys = require("./keys");

//load user model
var User = mongoose.model("users");


module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            proxy: true
        }, function(accessToken, refreshToken, profile, done){
            // console.log(accessToken);
            // console.log(profile);
            var image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf("?"));
            var newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            };
            //check for existing user
            User.findOne({
                googleID: profile.id
            }).then(function(user){
                if(user){
                    //return user
                    done(null, user);
                }else{
                    //create user
                    new User(newUser)
                    .save()
                    .then(function(user){
                        done(null, user);
                    });
                }
            })
        })
    );
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id).then(function(user){
            done(null, user);
        });
    });
}

module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that")
        res.redirect("/");
    },
    ensureGuest: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect("/dashboard");
        }else{
            return next();
        }
    }
};


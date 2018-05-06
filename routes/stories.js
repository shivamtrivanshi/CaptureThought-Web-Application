var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Story = mongoose.model("stories");
var User = mongoose.model("users");
var {ensureAuthenticated, ensureGuest} = require("../halper/auth");

//stories route
router.get("/stories", function(req, res){
    Story.find({status: "public"}).populate("user").sort({date: "desc"}).exec(function(err, stories){
        if(err){
            req.flash("error", "Connection error!");
            res.redirect("back");
        }else{
            res.render("stories/stories", {stories: stories});
        }
    });

});

//List stories from a user
router.get("/stories/user/:userId", function(req, res){
    Story.find({
        user: req.params.userId,
        status: "public"
    }).populate("user").sort({date: "desc"}).exec(function(err, stories){
        if(err){
            req.flash("error", "Story not Found From this user")
            res.redirect("/stories");
        }else{
            res.render("stories/user-stories", {stories: stories});
        }
    });
});

//logged in user stories
router.get("/stories/my", ensureAuthenticated, function(req, res){
    Story.find({
        user: req.user.id
    }).populate("user").sort({date: "desc"}).exec(function(err, stories){
        if(err){
            req.flash("error", "Connection error!");
            res.redirect("/dashboard");
        }else{
            res.render("stories/my-stories", {stories: stories});
        }
    });
});


//add story form
router.get("/stories/add", ensureAuthenticated, function(req, res){
    res.render("stories/add");
});

//edit story form
router.get("/stories/edit/:id", ensureAuthenticated, function(req, res){
    Story.findById(req.params.id, function(err, foundStory){
        if(err || !foundStory){
            req.flash("error", "Story not found, Something went wrong");
            res.redirect("/dashboard");
        }else{
            if(foundStory.user != req.user.id){
                res.redirect("/stories");
            }else{
                res.render("stories/edit", {story: foundStory});
            }
        }
    });
  
});

//Process add stories in database
router.post("/stories", function(req, res){
    req.body.body = req.sanitize(req.body.body);
    var allowComments;
    if(req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }

    var newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    };
    //create a story and save in database
    Story.create(newStory, function(err, story){
        if(err || !story){
            req.flash("error", "Please fill out all field");
            res.redirect("/stories/add");
        }else{
            res.redirect("/stories/show/"+ story.id);
        }
    });
});

//show stories route
router.get("/stories/show/:id", function(req, res){
    Story.findById(req.params.id).populate("user").populate("comments.commentUser")
    .exec(function(err, foundStory){
        if(err || !foundStory){
            req.flash("error", "Story not found");
            res.redirect("/stories");
        }else{
            //check if story is public or not
            if(foundStory.status === "public"){
                res.render("stories/show", {story: foundStory});
            }else{
                if(req.user){
                    if(req.user.id == foundStory.user._id){
                        res.render("stories/show", {story: foundStory});
                    }else{
                        res.redirect("/stories");
                    }
                }else{
                    res.redirect("/stories");
                }
 
            }
           
        }
    });
});

//Edit form process
router.put("/stories/:id", function(req, res){
    var allowComments;
    if(req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }

    var updateStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
    };

    Story.findByIdAndUpdate(req.params.id, updateStory, function(err, updatedStory){
        if(err || !updatedStory){
            req.flash("error", "Connection error!");
            res.redirect("/dashboard");
        }else{
            res.redirect("/stories/show/"+ updatedStory.id);
        }
    });
});

//delete stories route
router.delete("/stories/:id", ensureAuthenticated, function(req, res){
    Story.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Connection error!")
            res.redirect("/dashboard");
        }else{
            res.redirect("/dashboard");
        }
    });
});

router.post("/stories/comment/:id", function(req, res){
    Story.findById(req.params.id, function(err, story){
        if(err || !story){
            req.flash("error", "Connection error!")
            res.redirect("/stories/show/" + story.id);
        }else{
            var newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            };
            //add to comments array
            story.comments.unshift(newComment);

            story.save()
            .then(function(story){
                res.redirect("/stories/show/" + story.id);
            });
        }
    });
});

module.exports = router;
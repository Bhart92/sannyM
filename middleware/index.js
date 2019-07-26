var Post = require("../models/post");
var Project = require("../models/projects");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "you need to be logged in.")
  res.redirect("back");
};
middlewareObj.blogExistence = function(req, res, next){
  if(req.isAuthenticated()){
    Post.findById(req.params.id, function(err, post){
      if(err || !post){
        req.flash("error", "Oops, something went wrong, try again.")
        res.redirect("back");
      } else{
        next();
      }
      });
  }
};
middlewareObj.projectExistence = function(req, res, next){
  if(req.isAuthenticated()){
    Project.findById(req.params.id, function(err, project){
      if(err || !project){
        req.flash("error", "Oops, something went wrong, try again.")
        res.redirect("back");
      } else{
        next();
      }
    })
  }
};
module.exports = middlewareObj;

var express = require("express"),
    router = express.Router(),
    Project = require("../models/projects"),
    User = require("../models/user"),
    passport = require("passport"),
    middleware = require("../middleware"),
    multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif|tif)$/i)) {
        return cb(new Error(''), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter}),
    cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dava2zan7',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
//index route
router.get("/", function(req, res){
  Project.find({}, function(err, projects){
    User.findById("5d3157fa065d1f0017690599", function(err, user){
      if(err){
        console.log(err);
      } else{
        res.render("projects/index", {projects: projects, user: user});
      }
    });
  });
});
//update routes
router.get("/:id/edit", middleware.isLoggedIn, middleware.projectExistence, function(req, res){
  Project.findById(req.params.id, function(err, project){
    User.findById("5d3157fa065d1f0017690599", function(err, user){

    if(err){
      req.flash('error', "yuh dun fucked up! try again.");
      console.log(err);
      res.redirect("back");
    } else{
      res.render("projects/edit.ejs", {project: project, user: user});
    }
  });
  });
});
router.put("/:id", middleware.isLoggedIn, middleware.projectExistence, upload.single("image"), function(req, res){
  Project.findById(req.params.id, async function(err, project){
    if(err){
      req.flash('error', "yuh dun fucked up! try again.");
      res.redirect("back");
    } else{
        if(req.file){
          try{
            await cloudinary.v2.uploader.destroy(project.imageId);
            var result = await cloudinary.v2.uploader.upload(req.file.path);
            project.imageId = result.public_id;
            project.image = result.secure_url;
          } catch(err){
            req.flash("error", "it didnt work");
            return res.redirect("back");
          }
      }
      project.title = req.body.title
      project.save();
      req.flash("success", "updated");
      res.redirect("/");
    }
  });
});
//create routes
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("projects/new.ejs");
});
router.post("/", middleware.isLoggedIn, upload.single("image"), function(req, res){
  if(!req.file){
    req.flash("error", "you need to upload a file!");
    return res.redirect("back");
  } else{
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect("back");
      }
      // add cloudinary url for the image to the Post object under image property
      req.body.project.image = result.secure_url;
      // add image's public_id to Post object
      req.body.project.imageId = result.public_id;
      Project.create(req.body.project, function(err, project) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect("back");
        }
        req.flash("success", "added to gallery");
        res.redirect('/');
      });
    });
  }
});
//destroy routes
router.delete("/:id", middleware.isLoggedIn, function(req, res) {
  Project.findById(req.params.id, function(err, project){
    if(err){
      req.flash('error', "yuh dun fucked up! try again.");
      console.log(err);
    } else{
      project.remove();
      req.flash('success', "Project deleted.");
      res.redirect("/");
    }
  });
});
module.exports = router;

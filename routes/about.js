var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Project = require("../models/projects"),
    passport = require("passport"),
    multer = require('multer'),
    middleware = require("../middleware");
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
var upload = multer({ storage: storage, fileFilter: imageFilter})
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'smao',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
router.get("/", function(req, res){
  User.findById("5d3157fa065d1f0017690599", function(err, user){
  // User.findById("5d147a17bb75135d80cad313", function(err, user){
    if(err){
      console.log(err);
    }
    res.render("about/index", {user: user});
  });
});
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err){
      req.flash("error", "something went wrong, try again.")
    }
    res.render("about/edit", {user: user});
  });
});
router.put("/:id", middleware.isLoggedIn, upload.single("image"), function(req, res){
  User.findById("5d3157fa065d1f0017690599", async function(err, user){
    // User.findById("5d147a17bb75135d80cad313", async function(err, user){
    if(err){
      console.log(user);
    } else{
      if(req.file){
        try{
          await cloudinary.v2.uploader.destroy(user.imageId);
          var result = await cloudinary.v2.uploader.upload(req.file.path);
          user.imageId = result.public_id;
          user.image = result.secure_url;
        } catch(err){
          console.log(err);
          return res.redirect("back");
          }
        }
        user.about = req.body.about;
        user.save();
        req.flash("success", "Updated.");
        res.render("about/index", {user: user});
      }
    });
  });
module.exports = router;

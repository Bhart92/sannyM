var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Post = require("../models/post"),
    Project = require("../models/projects"),
    passport = require("passport"),
    middleware = require("../middleware"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto"),
    multer = require('multer');
require("dotenv").config();
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
        return cb(new Error(''), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'smao',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
router.post("/login", passport.authenticate("local",
{
    successRedirect: "back", failureRedirect: "/"
  }), function(req, res){
});
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged out.");
  res.redirect("/");
});
//Password reset routes
router.get("/forgot", middleware.isLoggedIn, function(req, res){
  res.render("forgot");
});
router.post("/forgot", middleware.isLoggedIn, function(req, res, next){
  async.waterfall([
    function(done){
      crypto.randomBytes(20, function(err, buf){
        if(err){
          req.flash("Something went wrong, please try again");
          res.redirect("back");
        }
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done){
      User.findOne({email: req.body.email }, function(err, user){
        if(err){
          req.flash("Something went wrong, plase try again");
          res.redirect("back");
        }
        if(!user){
          req.flash("error", "No account with that email address found");
          return res.redirect("/forgot");
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // pass change token expires after 1 hour

        user.save(function(err){
          done(err, token, user);
        });
      });
    },
    function(token, user, done){
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'hartwebdev92@gmail.com', //Left of at 6:30 for youtube course -- password reset ********************!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hartwebdev92@gmail.com',
        text: 'Click the link below to change your apssword. http://' + req.headers.host + '/reset/' + token + '\n\n'
      };
      smtpTransport.sendMail(mailOptions, function(err){
        if(err){
          req.flash("Something went wrong, plase try again");
          res.redirect("back");
        }
        console.log('mail sent');
        req.flash("success", 'reset email sent.');
        done(err, 'done');
      });
    }
  ], function(err){
    if(err) return next(err);
    res.redirect('/forgot');
  });
});
router.get('/reset/:token', middleware.isLoggedIn, function(req, res){
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
    if(err){
      req.flash("error", "yuh dun fucked up, try gain.");
      res.redirect("/");
    }
    if(!user){
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});
router.post("/reset/:token ", middleware.isLoggedIn, function(req, res){
  async.waterfall([
    function(done){
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
        if(err){
          req.flash("error", "yuh dun fucked up, try gain.");
          res.redirect("back");
        }
        if(!user){
          return res.redirect('/forgot');
        }
        if(req.body.password === req.body.confirm){
          user.setPassword(req.body.password, function(err){
            if(err){
              req.flash("error", "yuh dun fucked up, try gain.");
              res.redirect("/");
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err){
              if(err){
                req.flash("error", "yuh dun fucked up, try gain.");
                res.redirect("back");
              }
              req.logIn(user, function(err){
                done(err, user);
              });
            });
          });
        } else{
          return res.redirect("back");

        }
      });
    },
    function(user, done){
       var smtpTransport = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
           user: 'hartwebdev92@gmail.com',
           pass: process.env.GMAILPW
         }
       });
       var mailOptions = {
         to: user.email,
         from: 'hartwebdev92.com',
         subject: 'Your password has been changed',
         text: 'Hello, \n\n' +
                'This is a confirmation that the password for your account ' + user.email + 'has just been changed'
       };
       smtpTransport.sendMail(mailOptions, function(err){
         if(err){
           req.flash("error", "yuh dun fucked up, try gain.");
           res.redirect("back");
         }
         res.render("contact", { messages: req.flash("success", "A reset link was sent to your email.") });
         done(err);
       });
    }
  ],function(err){
    if(err){
      req.flash("error", "yuh dun fucked up, try gain.");
      res.redirect("back");
    }
    res.render("contact", { messages: req.flash("success", "A reset link was sent to your email.") });
  });
});
// //Create route
// router.get("/register", function(req, res){
//   res.redirect("back");
// })
// router.post("/register", function(req, res){
//   var newUser = new User({
//     username: req.body.username,
//     image: req.body.image,
//     email: req.body.email,
//     about: req.body.about,
//     });
//   if(req.body.adminCode === 'secretcode123'){
//     newUser.isAdmin = true;
//   }
// User.register(newUser, req.body.password, function(err, user){
//   if(err){
//     console.log(err);
//     return res.redirect("/register");
//   }
//     passport.authenticate("local")(req, res, function(){
//     res.redirect("/");
//     });
//   });
// });
module.exports = router;

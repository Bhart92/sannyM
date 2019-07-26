var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    middleware = require("../middleware"),
    User = require("../models/user"),
    nodemailer = require("nodemailer");
require("dotenv").config();
//Gallery portion////////////////////
router.get("/", function(req, res){
  User.findById("5d3157fa065d1f0017690599", function(err, user){
    res.render("contact", {user: user});
  });
});
//sends contact form email
router.post('/', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'thesannymao@gmail.com',
      pass: process.env.GMAILPW
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: 'thesannymao@gmail.com',
    subject: 'New message from sannym.com!',
    text:`${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      req.flash("error", error.responseCode + ", message didn't send. Please try again!");
      res.redirect('/contact');    }
    else {
      req.flash("success", "Message sent. Ill get back to you as soon as possible.")
      res.redirect('/contact');
    }
  });
});
module.exports = router;

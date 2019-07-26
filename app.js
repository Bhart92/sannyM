var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    moment = require("moment"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    localStrategy = require("passport-local"),
    authRoutes = require("./routes/auth"),
    aboutRoutes = require("./routes/about"),
    contactRoutes = require("./routes/contact"),
    projectRoutes = require("./routes/projects"),
    flash = require("connect-flash"),
    nodemailer = require("nodemailer"),
    port = process.env.PORT || 3000;

require("dotenv").config();
var Project = require("./models/projects"),
    User = require("./models/user");
// APP CONFIG
// mongoose.connect("mongodb://localhost:27017/sannyM", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://smao:%23Jack2019@sannyportfolio-mstes.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });

app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(flash());
app.use(require("express-session")({
  secret: "Smao",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//////////////////////////////////////
//Passport CONFIG
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//////////////////////////////////////
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.locals.moment = require("moment");
app.use("/", projectRoutes);
app.use("/about", aboutRoutes);
app.use("/contact", contactRoutes);
app.use(authRoutes);

app.get("*", function(req, res){
  res.redirect("/ ");
});

app.listen(port, function (err) {
  if(err){
    console.log(err);
  }
    console.log("Server up!");
});

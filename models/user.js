var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: {type: String, unique: true},
  about: String,
  image: String,
  imageId: {type: String, default: '123'},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: {type: Boolean, default: false},
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

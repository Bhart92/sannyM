var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var postSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String,
  imageId: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
});
var Post = mongoose.model("Post", postSchema);

module.exports = mongoose.model("Post", postSchema);

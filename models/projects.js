var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    title: String,
    image: String,
    imageId: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
});
var Project = mongoose.model("Project", projectSchema);

module.exports = mongoose.model("Project", projectSchema);

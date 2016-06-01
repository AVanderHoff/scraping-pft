var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({

  body: {
    type:String
  }
});

var Comments = mongoose.model('comments', CommentSchema);
module.exports = Comments;
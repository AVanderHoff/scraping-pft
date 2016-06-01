var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var ArticleSchema = new Schema({
  postid: {
    type:String,
    unique:true
  },
  title:{
  	type:String,
  },
  comments: [{
      type: Schema.Types.ObjectId,
      ref: 'comments'
  }],
  content:[{
  	  type:String,

  }]


});


ArticleSchema.plugin(autoIncrement.plugin, 'articles');
var Article = mongoose.model('articles', ArticleSchema);
module.exports = Article;
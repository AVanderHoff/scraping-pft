var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var url = require('url');
//mongoose.connect('mongodb://localhost/profootballtalk');
//mlab connection information
mongoose.connect("mongodb://andrew:password@ds043324.mlab.com:43324/profootballtalk", function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var db = mongoose.connection;
autoIncrement.initialize(db);

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var Article = require('../models/articles.js');
var Comment = require('../models/comments.js');

module.exports = function(app){

  //display main page
  app.get('/',function(req,res){
    res.send(index.html);
  })

  //get number of articles in database
  app.get('/count',function(req,res){

    Article.count({},function(err,count){
      var countObj = {
        count:count
      }

      res.json(countObj);
    })

  })





  //get article by id, return entire article entry, including
  // populated comments
  app.get('/articles',function(req,res){
    var url_parts = url.parse(req.url,true);

       Article.findOne({_id:url_parts.query.number})
        .populate('comments')
        .exec(function(err, doc) {
         
          var responsedata = {
             article:doc
          }
          
          res.json(responsedata);

        });

  });

  //scrapes articles off of www.profootballtalk.com, first gets links then opens 
  // those links using request. Scrapes the links for content.
  app.get('/scrape',function(req,res){

  request('http://profootballtalk.nbcsports.com/', function (error, response, html) {

    var B = cheerio.load(html);
    
    B('a',"#top-headlines").each(function(i, element){

        var title = B(this).attr('href');
        
        request(title,function(error2,response2,html2){

            var $ = cheerio.load(html2);
            var title = $('title').text();
            var postid = $('#content').children().first().attr('id')
            var content = [];

            $('p','#' + postid).each(function(i,element){

                content.push($(this).text());
            })

          var entry = new Article({
            "postid":postid,
            "title":title,
            "content":content,
            "comments":[]
          });

          entry.save(function(err, doc) {
            if (err) {
              console.log(err);
            } 
            else {
              console.log(doc);
            }
          });
        
        });
      });
    });
  });

  //post new comment
  app.post('/postcomments',function(req,res){
  var url_parts = url.parse(req.url,true);

    var comment = new Comment(req.body);

    comment.save(function(err, doc) {
      if (err) {
        res.send(err);
      } 
      else {
        Article.findOneAndUpdate({_id:url_parts.query.number}, {$push: {'comments': doc._id}}, {new: true})
          .populate('comments')
          .exec(function(err, doc3){
              res.json(doc3.comments);
          }); 
      }
    });
  });

  //delete last comment in in array
  app.get('/deletecomment',function(req,res){
    var url_parts = url.parse(req.url,true);
    Article.findOneAndUpdate({_id:url_parts.query.number}, {$pop: {'comments': 1}})
      .populate('comments')
      .exec(function(err, doc4){

        res.json(doc4.comments);
        var commentid = doc4.comments[doc4.comments.length - 1]._id;

        Comment.findByIdAndRemove(commentid,function(){
            console.log(commentid + ' deleted');
          })
      });
  });





}
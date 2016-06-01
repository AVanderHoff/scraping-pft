var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var PORT = process.env.PORT || 3000 ;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
//app.use(logger('dev'));


app.use(express.static('views'));


require('./controllers/cheerio.js')(app);


app.listen(PORT,function(){

	console.log("app listening on port " + PORT);
})
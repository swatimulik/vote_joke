var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 8888;
var mongodb = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
//var jokes=[{setup:"Our wedding was so beautiful,",punchline:"even the cake was in tiers"},{setup:"I'm reading a book on the history of glue",punchline:"I just can't seem to put it down"},{setup:"What do you call an Argentinian with a rubber toe?",punchline:"Roberto"}];
var jokes=[{setup:"Our wedding was so beautiful,",punchline:"even the cake was in tiers", votes: 0},{setup:"I'm reading a book on the history of glue",punchline:"I just can't seem to put it down", votes: 0},{setup:"What do you call an Argentinian with a rubber toe?",punchline:"Roberto", votes: 0}];
var uri = "mongodb://swati:hello@ds145385.mlab.com:45385/jokesdb";
app.use(bodyParser.json());
app.listen(process.env.PORT || port, function(){
    console.log("Listening on " + port);
});

app.use(express.static('static'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/static/index.html');
});



app.post('/upvote', function(req, res) {
    console.log("Someone tried to upvote something");
    console.log(req.body);
    var jokeIndex = req.body.id;
 //  if (typeof jokes[jokeIndex].votes === 'undefined') {
 //       console.log("Creating vote for this joke");
 //       jokes[jokeIndex].votes = 0;
 //   }
 //   jokes[jokeIndex].votes++;
 //  jokes[jokeIndex].name=req.body.name;
 //   res.send(jokes[jokeIndex]); 
		mongodb.connect(uri, function(err,db){
		var collection = db.collection('jokes');
		collection.findOneAndUpdate(
		{ _id: ObjectID(jokeIndex) },
		{ $inc: 	{"votes" : 1}}, 
		function(err, result){
			console.log("result is"+ result);
			result.value.votes++;
			res.send(result.value);
		}

		);
		});	
});

app.post('/downvote', function(req, res) {
    console.log("Someone tried to downvote something.");
    console.log(req.body);
    var jokeIndex = req.body.id;
   mongodb.connect(uri, function(err,db){
		var collection = db.collection('jokes');
		collection.findOneAndUpdate(
		{ _id: ObjectID(jokeIndex) },
		{ $inc: 	{"votes" : -1}}, 
		function(err, result){
			console.log("result is"+ result);
			result.value.votes--;
			res.send(result.value);
		}

		);
		});	
});

app.get('/admin', function(req, res){
	console.log('Attempting to add into database');
	mongodb.connect(uri, function(err, db){
		var collection = db.collection('jokes');
		collection.insertMany(jokes, function(err, results){
			console.log(err+"results in /admin insertMany" +results);
			res.send(results);
			db.close(); 
		} );
	});
});

app.get('/jokes', function(req, res){
	
	
	mongodb.connect(uri, function(err,db){
		var collection = db.collection('jokes');
		collection.count(function(err, count){
			console.log(count+"no of documents");
			var randomNumber = Math.floor(Math.random()*count );
			collection.find().limit(-1).skip(randomNumber).next(
			function(err, results){
				res.send(results);
			}
			);
		}
			);
		} );
	} );

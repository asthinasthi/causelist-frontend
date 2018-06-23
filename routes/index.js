var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
  res.send('Hello World!!!');
});

router.get('/causelists/available', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	var MongoClient = require('mongodb').MongoClient;
 	console.log(req);
// Connection URL db:causelists
	var url = 'mongodb://localhost:27017/causelists';
// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
	  console.log("Connected correctly to server");
	  console.log('Request Params')
	  console.log(req.param)
	  console.log('Case Date ' + req.query.caseDate)
	  var collection = db.collection('kat');
	  var dateStr = req.query.caseDate; //yyyy-mm-dd
	  var utcDate = new Date(dateStr)
	  console.log('utc date: '+ utcDate)
	  var queryParams = {
	  	"caseDate": utcDate
	  };
	  console.log('Query parameters ....')
	  console.log(queryParams)
	  collection.find(queryParams).toArray(function(err, docs){
	  	if(err){
	  		console.log(err)
	  		res.send('Error while retrieving db')
	  	} else {
	  		console.log('Found the following records');
		  	console.dir(docs);
		  	if(docs.length > 0){
		  		res.send(true);
		  	} else {
		  		res.send(false);
		  	}
	  	}

	  });
	  db.close();
	});
});

router.get('/causelists', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	var MongoClient = require('mongodb').MongoClient;
 console.log(req);
// Connection URL db:causelists
var url = 'mongodb://localhost:27017/causelists';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");
  console.log('Request Params')
  console.log(req.param)
  console.log('Case Date ' + req.query.caseDate)
  var collection = db.collection('kat');
  // var queryParams = {
  // 	"caseDate": { '$gte' : new Date("11/11/2016")}
  // };
  // var queryParams = {
  // 	"caseDate": new Date("11/11/2016"),
  // 	"$text": {"$search": "manjunatha"}
  // };
  var date = new Date(req.query.caseDate);
  var queryParams = {
  	// "caseDate": new Date(date.toISOString()),
  	"caseDate": date,
  	// "$text": {"$search": req.query.advocateNames}
    "content": {$regex: req.query.advocateNames, $options: "i"}
  };
  console.log('Query parameters ....')
  console.log(queryParams)
  collection.find(queryParams).toArray(function(err, docs){
  	if(err){
  		console.log(err)
  		res.send('Error while retrieving db')
  	} else {
  		console.log('Found the following records');
	  	console.dir(docs);
	  	res.send(docs);
  	}

  });
  db.close();
});

});

module.exports = router;

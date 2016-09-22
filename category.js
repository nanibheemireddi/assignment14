var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = 8080;

var categories = [];
var categoryNextId = 1;

app.use(bodyParser.json());

app.get('/categories', function(req,res){

	var categoryquery = req.query;
	var filtercategories = categories;
	if(categoryquery.hasOwnProperty("name") && categoryquery.name.length > 0){
		var filtercategories = _.filter(filtercategories, function(obj){
			return obj.Name.toLowerCase().indexOf(categoryquery.name.toLowerCase()) > -1;
		});
	}

	if(categoryquery.hasOwnProperty("desc") && categoryquery.desc.length > 0){
		var filtercategories = _.filter(filtercategories, function(obj){
			return obj.description.toLowerCase().indexOf(categoryquery.desc.toLowerCase()) > -1;
		});
	}

	res.json(filtercategories);
});

app.get('/categories/:id', function(req, res){
	var categoryid = parseInt(req.params.id, 10);
	var matched = _.findWhere(categories, {id: categoryid});

	if(matched){
		res.json(matched);
	}else{
		return res.status(404).json("{error: page not found}");
	}
	//res.send('asking todo for id  ' +req.params.id);
});

app.post('/categories', function(req, res){

	var body = req.body;
	body.id = categoryNextId++;
	categories.push(body);
	res.json(body);
});


app.delete('/categories/:id', function(req, res){
	var categoryid = parseInt(req.params.id, 10);
	var matched = _.findWhere(categories, {id: categoryid});

	if(!matched){
		return res.status(404).json("{error: page not found}");
	} else {
		categories = _.without(categories, matched);
		res.json(matched);
	}
});

app.put('/categories/:id', function(req, res){
	var categoryid = parseInt(req.params.id, 10);
	var matched = _.findWhere(categories, {id: categoryid});
	var body = req.body;
	var validcategories = {};

	if(body.hasOwnProperty("Name") && _.isString(body.Name) && body.Name.trim().length > 0){
		validcategories.Name = body.Name;
	} else {
		return res.status(400).json("{error: category name contains error}");
	}

	if(body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0){
		validcategories.description = body.description
	} else {
		return res.status(400).json("{error: description contains error}");
	}
	_.extend(matched, validcategories);
	res.json(matched);
});

app.listen(PORT, function(){
	console.log('express server is started on ' +PORT);
});
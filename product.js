var express = require('express');
var _ = require('underscore');
var bodyParser = require('body-parser');

var app = express();
var PORT = 8080;

var products = [];
var productNextId = 1;

app.use(bodyParser.json());

app.get('/products', function(req,res){
	var queryproduct = req.query;
	var filterproducts = products;
	if(queryproduct.hasOwnProperty("desc") && queryproduct.desc.length > 0){
		var filterproducts = _.filter(filterproducts, function(obj){
			return obj.Description.toLowerCase().indexOf(queryproduct.desc.toLowerCase()) > -1;
		});
	}

	if(queryproduct.hasOwnProperty("quan") && queryproduct.quan.length > 0){
		var filterproducts = _.filter(filterproducts, function(obj){
			return obj.Quantity > queryproduct.quan;
		});
	}

	if(queryproduct.hasOwnProperty("name") && queryproduct.name.length > 0){
		var filterproducts = _.filter(filterproducts, function(obj){
			return obj.productName.toLowerCase().indexOf(queryproduct.name.toLowerCase()) > -1;
		});
	}

	if(queryproduct.hasOwnProperty("max") && queryproduct.hasOwnProperty("min")){
		if(queryproduct.max.length > 0 && queryproduct.min.length > 0){
			var filterproducts = _.filter(filterproducts, function(obj){
				return queryproduct.min < obj.productPrice && obj.productPrice < queryproduct.max;
			});
		}
	}

	// if(queryproduct.hasOwnProperty("min")){
	// 	if(queryproduct.min.length > 0){
	// 		var filterproducts = _.filter(filterproducts, function(obj){
	// 			return queryproduct.min < obj.productPrice;
	// 		});
	// 	}
	// }


	res.json(filterproducts);
});

app.get('/products/:id', function(req, res){
	var productid = parseInt(req.params.id, 10);
	var matched = _.findWhere(products, {id: productid});

	if(matched){
		res.json(matched);
	}else{
		res.status(404).send();
	}
});

app.post('/products', function(req, res){

	var body = req.body;
	body.id = productNextId++;
	products.push(body);
	res.json(body);
});

app.delete('/products/:id', function(req, res){
	var productid = parseInt(req.params.id, 10);
	var matched = _.findWhere(products, {id: productid});
	if(matched){
		products = _.without(products, matched);
		res.json(matched);
	} else {
		res.status(404).json("{error: match not found }");
	}
});

app.put('/products/:id', function(req, res){
	//console.log("haiii");
	var productid = parseInt(req.params.id, 10);
	var matched = _.findWhere(products, {id: productid});
	var body = _.pick(req.body, 'productName', 'productPrice','Description');
	var validattributes = {};

	if(!matched){
		return res.status(400).json("{error: page not found}");
	}


	if(body.hasOwnProperty("Description") && !_.isString(body.Description)){
		validattributes.Description = body.Description;
	} else if(body.hasOwnProperty("Description")){
		return res.status(400).json("{error: Description contains error}");
	}


	if(body.hasOwnProperty('productName') && _.isString(body.productName) && body.productName.trim().length > 0){
	//	console.log("hai");
		validattributes.productName = body.productName;
	} else if(body.hasOwnProperty("productName")){
		return res.status(400).json("{error: productName contains some error}");
	}

	if(body.hasOwnProperty("productPrice") && !_.isString(body.productPrice)){
		validattributes.productPrice = body.productPrice;
	} else if(body.hasOwnProperty("productPrice")){
		return res.status(400).json("{error: price contains error}");
	}
	_.extend(matched, validattributes);
	 res.json(matched);
});

app.listen(PORT, function(){
	console.log('express server is started on ' +PORT);
});
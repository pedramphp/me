"use strict";
var express = require('express'),
	app = express(),
	hbs = require('hbs');

app.set('view engine', 'html');

app.engine('html', hbs.__express);

app.use(express.bodyParser());

app.use(express.static('public'));


app.get('/', function(req, res) {
	res.render('index', {
		title:"About Me"
	});
});

app.listen(3000);
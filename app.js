"use strict";
var express = require('express'),
	http =	require('http'),
	app = express(),
    exphbs  = require('express3-handlebars'),
    hbs,
    VIEW_EXT_NAME = ".hbs";


hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo: function () { return 'FOO!'; },
        bar: function () { return 'BAR!'; }
    },
    defaultLayout: 'main',
    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'views/partials/'
    ],
    extname: VIEW_EXT_NAME
});


app.engine(VIEW_EXT_NAME, hbs.engine);

app.set('view engine', VIEW_EXT_NAME);

app.use(express.bodyParser());

app.use(express.static('public'));

hbs.loadPartials(function (err, partials) {
    console.log("partials: ", partials);
    // => { 'foo.bar': [Function],
    // =>    title: [Function] }
});


// Middleware to expose the app's shared templates to the cliet-side of the app
// for pages which need them.
function exposeTemplates(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    hbs.loadTemplates('views/shared/', {
        cache      : app.enabled('view cache'),
        precompiled: true
    }, function (err, templates) {
        if (err) { return next(err); }

        // RegExp to remove the ".handlebars" extension from the template names.
        var extRegex = new RegExp(hbs.extname + '$');

        // Creates an array of templates which are exposed via
        // `res.locals.templates`.
        templates = Object.keys(templates).map(function (name) {
            return {
                name    : name.replace(extRegex, ''),
                template: templates[name]
            };
        });

        // Exposes the templates during view rendering.
        if (templates.length) {
            res.locals.templates = templates;
        }

        next();
    });
}

app.get('/', exposeTemplates, function(req, res) {
	res.render('pages/home', {
        isDev: process.env.NODE_ENV === "development",
		title: "About Me",
		// Override `foo` helper only for this rendering.
        helpers: {
            foo: function () { return 'foo.'; }
        }
	});
});

if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "development";
}

if(!app.get('port')){
	app.set('port', process.env.PORT || 3000);
}

http.createServer(app).listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});
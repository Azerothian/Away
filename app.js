/**
 * Module dependencies.
 */

var gamejs = require('./public/js/gamejs.js');
var map = require('./public/js/map.js');
var settings = require('./public/js/settings.js');

var express = require('express');
var nowjs = require('now');
var util = require('util');

map.SetupMap(settings.MapLayers, settings.TileSheet, settings.MapHeight,
		settings.MapWidth);

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
	res.render('index', {
		title : 'Nadir'
	});
});

var everyone = nowjs.initialize(app);

app.listen(9050);
console.log("Express server listening on port %d in %s mode",
		app.address().port, app.settings.env);

nowjs.on('connect', function() {

});

everyone.now.Server_RequestMap = function() {
	this.now.Client_SetMap(map.GetMap());
};
everyone.now.Server_SendMapTile = function(layer, tileSet, posX, posY, tileX,
		tileY) {
	map.SetMapTile(layer, tileSet, posX, posY, tileX, tileY);
};
everyone.now.Server_RequestMapTile = function(layer, posX, posY) {
	var t = map.GetMapTile(layer, posX, posY);
	this.now.Client_ReceiveMapTile(layer, t.tileSet, posX, posY, t.tileX,
			t.tileY);
};

map.AddSetMapTileHook(function(layer, x, y, t) {
	everyone.now
			.Client_ReceiveMapTile(layer, t.tileSet, x, y, t.tileX, t.tileY);
});


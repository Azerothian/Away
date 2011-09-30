// Setup Libs
var gamejs = require('gamejs');
var map = require('map');
var player = require('player');
var tile = require('tile');
var settings = require("settings");
var layer = require("layer");
// --- End ---

// Private Variables
var images = [ settings.TileSheet, settings.TileCharSheet ];

var tileSize = settings.TileSize;
var mapHeight = settings.MapHeight;
var mapWidth = settings.MapWidth;
var mapLayers = settings.MapLayers;

var screenHeight = settings.MapHeight * settings.TileSize;
var screenWidth = settings.MapWidth * settings.TileSize;

var mainSurface = null;
var currentPlayer = null;
var display = null;
var layers = [];

var gameReady = false;
var domReady = false;
var networkReady = false;
var initialised = false;

var setTileX = 0;
var setTileY = 0;

// --- End ---

gamejs.preload(images);
gamejs.ready(function() {
    gameReady = true;
    gamejs.time.fpsCallback(GameLoop, this, 26);
});

function initialise() {

    for ( var i = 0; i < mapLayers; i++) {
	layers[i] = layer.GetNewLayer();
	layers[i].Index = i;
	layers[i].ConvertMapToLayer(map.GetMap()[i]);
    }

    currentPlayer = player.GetNewPlayer();
    currentPlayer.OnPlayer_KeyDownSpace = function() {

    };

    display = gamejs.display.setMode([ screenWidth, screenHeight ]);
    initialised = true;
}

function GameLoop(msDuration) {
    if (!networkReady || !gameReady || !domReady) {
	return;
    }
    if (!initialised) {
	// debugger;
	initialise();
    }
    // gamejs.display.getSurface();
    mainSurface.fill("#000");
    layers.sort(function(a, b) {
	return a.Index - b.Index;
    });
    
    if(!$('#chkShowOnlyLayer').is(':checked')){
	for ( var i = 0; i < layers.length; i++) {
	    layers[i].draw(mainSurface);
	}
    } else {

	var selectMap = $("#layerSelect").val();
	layers[selectMap].draw(mainSurface);
    }
    var ev = gamejs.event.get();
    for ( var v = 0; v < ev.length; v++) {
	event = ev[v];
	if (event.type == gamejs.event.MOUSE_DOWN) {
	    switch (event.button) {
		case 0:
		    console.log("X:" + event.pos[0] + " Y:" + event.pos[1]);
		    console.log("Width:" + screenWidth + " Height:" + screenHeight);
		    if (event.pos[0] < screenWidth && event.pos[1] < screenHeight) {
			// console.log("TileX:" + setTileX + " TileY:"+setTileY);
			var xs = calcTilePos(event.pos[0]);
			var ys = calcTilePos(event.pos[1]);
			var selectMap = $("#layerSelect").val();
			SendMapTile(selectMap, settings.TileSheet, xs, ys,
			    setTileX, setTileY);
		    }
		    break;

	    }

	}
	currentPlayer.processEvent(event);
    }

    currentPlayer.update(msDuration);
    currentPlayer.draw(mainSurface);
//
// display.blit((new gamejs.font.Font('12px
// Sans-serif')).render(msDuration));
}
function SendMapTile(layer, tileSet, posX, posY, tileX, tileY) {
    now.Server_SendMapTile(layer, tileSet, posX, posY, tileX, tileY);
}

map.AddSetMapTileHook(function(layer, x, y, t) {
    layers[layer].SetTile(t.tileSet, x, y, t.tileX, t.tileY);
});
now.ready(function() {

    now.Client_ReceiveMapTile = function(layer, tileSet, x, y, tileX, tileY) {
	map.SetMapTile(layer, tileSet, x, y, tileX, tileY);
    };
    now.Client_SetMap = function(m) {
	map.SetMap(m);
	networkReady = true;
    };
    now.Server_RequestMap();

});
$(document).ready(function() {
    mainSurface = gamejs.display.getSurface();

    $("#tileSet").click(function(e) {
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;
	setTileX = calcTilePos(x);
	setTileY = calcTilePos(y);
    // console.log("TileX:" + setTileX + " TileY:"+setTileY);
    });

    domReady = true;

});

function calcTilePos(pos) {
    return Math.floor(pos / tileSize);
}

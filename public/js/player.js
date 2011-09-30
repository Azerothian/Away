var gamejs = require("gamejs");
var tile = require("tile");
var settings = require("settings");

var tileSize = settings.TileSize;
var tileSheet = settings.TileSheet;

var Player = function() {

	this.position = {
		x : 0,
		y : 0
	};
	var tileSheet = './images/chars1.png';
	this.tileUp = tile.GetNewTile(tileSheet, tileSize, 0, 3, 0, 0);
	this.tileDown = tile.GetNewTile(tileSheet, tileSize, 0, 0, 0, 0);
	this.tileLeft = tile.GetNewTile(tileSheet, tileSize, 0, 1, 0, 0);
	this.tileRight = tile.GetNewTile(tileSheet, tileSize, 0, 2, 0, 0);

	this.tileCurrent = this.tileDown;

	this.playerState = "down";

	this.draw = function(surface) {
		this.tileCurrent.SetPosition(this.position.x, this.position.y);
		this.tileCurrent.draw(surface);

	};
	this.processEvent = function(event) {
		var newx = this.position.x;
		var newy = this.position.y;
		var newps = this.playerState;
		if (event.type === gamejs.event.KEY_DOWN) {
			if (event.key === gamejs.event.K_SPACE) {
				this.OnPlayer_KeyDownSpace();
			}
			if (event.key === gamejs.event.K_DOWN) {
				newy = newy + tileSize;
				newps = "down";
			}
			if (event.key === gamejs.event.K_UP) {
				newy = newy - tileSize;
				newps = "up";
			}
			if (event.key === gamejs.event.K_LEFT) {
				newx = newx - tileSize;
				newps = "left";
			}
			if (event.key === gamejs.event.K_RIGHT) {
				newx = newx + tileSize;
				newps = "right";
			}
		}
		this.playerState = newps;
		this.position = {
			x : newx,
			y : newy
		};
	};
	this.update = function(ms) {

		switch (this.playerState) {
		case "up":
			this.tileCurrent = this.tileUp;
			break;
		case "down":
			this.tileCurrent = this.tileDown;
			break;
		case "left":
			this.tileCurrent = this.tileLeft;
			break;
		case "right":
			this.tileCurrent = this.tileRight;
			break;
		}
	};

	this.OnPlayer_KeyDownSpace = function() {
	};
};

exports.GetNewPlayer = function() {
	return new Player();
};

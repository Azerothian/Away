var gamejs = require("gamejs");
var settings = require("settings");

var Tile = function(tileset, tileSize, xTilePos, yTilePos, xPos, yPos) {
//	console.log("tileset: " + tileset + " tilesize: " + tileSize);
//	console.log("xTilePos: " + xTilePos + " yTilePos: " + yTilePos);
//	console.log("xPos: " + xPos + " yPos: " + yPos);
	Tile.superConstructor.apply(this, arguments);
	this.TileSet = tileset;
	this.TileSize = tileSize;
	this.xTilePos = xTilePos;
	this.yTilePos = yTilePos;

	this.SetTile = function(xTilePos, yTilePos) {
		this.xTilePos = xTilePos;
		this.yTilePos = yTilePos;
		this.image = gamejs.image.load(this.TileSet, this.TileSize, xTilePos,
				yTilePos);
	};
	this.GetTile = function() {
		return {
			x : this.xTilePos,
			y : this.yTilePos
		};
	};

	this.SetTile(xTilePos, yTilePos);
	this.rect = new gamejs.Rect([ xPos, yPos ], [ tileSize, tileSize ]);

	// General Functions

	this.SetPosition = function(x, y) {
		this.rect.left = x;
		this.rect.top = y;
	};
	this.GetPosition = function() {
		return {
			x : this.rect.left,
			y : this.rect.top
		};
	};
};
gamejs.utils.objects.extend(Tile, gamejs.sprite.Sprite);

exports.GetNewTile = function(tileset, tileSize, xTilePos, yTilePos, xPos, yPos) {

	return new Tile(tileset, tileSize, xTilePos, yTilePos, xPos, yPos);

};
exports.GetNewTileFromMap = function(m, x, y) {
	return new Tile(m.tileSheet, settings.TileSize, m.tileX, m.tileY, x, y);

};
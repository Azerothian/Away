var gamejs = require("gamejs");
var settings = require("settings");
var tile = require("tile");

exports.GetNewLayer = function()
{
	return new Layer();
};


var Layer = function() {

	this.tileMap = [];
	this.Index = 0;
	this.tileSize = settings.TileSize;
	this.surface = new gamejs.Surface([ settings.ScreenWidth,
			settings.ScreenHeight ]);

	return this;

};

Layer.prototype.RenderTiles = function() {
	this.surface.clear();
	for ( var x = 0; x < this.tileMap.length; x++) {
		if (this.tileMap[x] != null) {
			for ( var y = 0; y < this.tileMap[x].length; y++) {
				this.RenderTile(x, y);
			}
		}
	}

};
Layer.prototype.draw = function(s) {
	s.blit(this.surface);
};

Layer.prototype.ConvertMapToLayer = function(map) {
	for ( var x = 0; x < map.length - 1; x++) {
		for ( var y = 0; y < map[x].length - 1; y++) {
			this.SetTile(map[x][y].tileSet, x, y, map[x][y].tileX, map[x][y].tileY);
		}
	}
	this.RenderTiles();
};

Layer.prototype.ClearTile = function (gridX, gridY) {
	var startX = gridX * this.tileSize;
	var startY = gridY * this.tileSize;
	this.surface.context
			.clearRect(startX, startY, this.tileSize, this.tileSize);

};


Layer.prototype.SetTile = function(tileSet, gridX, gridY, tileX, tileY) {
	if (this.tileMap[gridX] == null) {
		this.tileMap[gridX] = [];
	}
	var tilePosX = gridX * this.tileSize;
	var tilePosY = gridY * this.tileSize;

	this.tileMap[gridX][gridY] = tile.GetNewTile(tileSet, this.tileSize, tileX,
			tileY, tilePosX, tilePosY);
	this.ClearTile(gridX, gridY);
	this.RenderTile(gridX, gridY);
};

Layer.prototype.RenderTile = function(gridX, gridY) {
	if (this.tileMap[gridX][gridY] != null) {
		this.tileMap[gridX][gridY].draw(this.surface);
	}
};


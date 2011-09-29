var gamejs = require("gamejs");
var settings = require("settings");
var tile = require("tile");

exports.GetNewLayer = function() {
	return new Layer();
};
var Layer = function() {

	this.tileMap = [];
	this.Index = 0;
	this.tileSize = settings.TileSize;
	this.ClearTile = clearTile;
	this.surface = new gamejs.Surface([ settings.ScreenWidth,
			settings.ScreenHeight ]);
	this.SetTile = setTile;

	this.draw = drawLayer;
	this.ConvertMapToLayer = convertMapToLayer;
	this.RenderTiles = renderTiles;
	l = this;
	function renderTiles() {
		l.surface.clear();
		for ( var x = 0; x < mapWidth; x++) {
			if (tileMap[x] != null) {
				for ( var y = 0; y < mapHeight; y++) {
					renderTile(x, y);
				}
			}
		}
	}
	

	function drawLayer(s) {
		s.blit(l.surface);
	}
	function convertMapToLayer(map) {
		for ( var x = 0; x < map.length - 1; x++) {
			for ( var y = 0; y < map[x].length - 1; y++) {
				// debugger;
				setTile(map[x][y].tileSet, x, y, map[x][y].tileX,
						map[x][y].tileY);
			}
		}
	}
	

	function clearTile(gridX, gridY) {
		var startX = gridX * this.tileSize;
		var startY = gridY * this.tileSize;
		l.surface.context.clearRect(startX, startY, l.tileSize, l.tileSize);

	}
	

	function renderTile(gridX, gridY) {
		if (l.tileMap[gridX][gridY] != null) {
			l.tileMap[gridX][gridY].draw(l.surface);
		}
	}
	function setTile(tileSet, gridX, gridY, tileX, tileY) {
		if (l.tileMap[gridX] == null) {
			l.tileMap[gridX] = [];
		}
		var tilePosX = gridX * l.tileSize;
		var tilePosY = gridY * l.tileSize;

		l.tileMap[gridX][gridY] = tile.GetNewTile(tileSet, l.tileSize, tileX,
				tileY, tilePosX, tilePosY);
		clearTile(gridX, gridY);
		renderTile(gridX, gridY);
	}


};

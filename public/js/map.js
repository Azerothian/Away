var map = [];
var setFunctions = [];

exports.SetupMap = function(layers, tileSet, tileHeight, tileWidth) {
	for ( var l = 0; l < layers; l++) {
		map[l] = [];
		for ( var x = 0; x < tileHeight; x++) {
			map[l][x] = [];
			for ( var y = 0; y < tileWidth; y++) {
				map[l][x][y] = {
					tileSet : tileSet,
					tileX : 0,
					tileY : 0
				};
			}
		}
	}
	return map;
};

exports.AddSetMapTileHook = function(func)
{
	setFunctions.push(func);
};

exports.GetMap = function() {
	return map;
};
exports.SetMap = function(m) {
	 map = m;
};

exports.SetMapTile = function(layer, tileSet, posX, posY, tileX, tileY) {
	map[layer][posX][posY] = {
		tileSet : tileSet,
		tileX : tileX,
		tileY : tileY
	};
		
	setFunctions.forEach(function(f){
		f(layer, posX, posY, map[layer][posX][posY]);
	});
};
exports.GetMapTile = function(layer, posX, posY) {
	return map[layer][posX][posY];
};





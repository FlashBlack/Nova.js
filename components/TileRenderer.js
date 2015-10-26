"use strict";

Nova.NewComponent('TileRenderer', function() {
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	var originalMap;
	var tileset, tilesetSize;
	var render = new Image();

	this.Create = function(parameters) {
		var defaultParameters = {
			Alpha: 1,
			drawAtInteger: false,
			pointFiltering: true,
		}
		parameters = Nova.System.SetDefaultProperties(parameters, defaultParameters);
		this.Alpha = parameters.Alpha;
		this.drawAtInteger = parameters.drawAtInteger;

		if (!parameters.hasOwnProperty('Tilemap')) return false;
		originalMap = Nova.Loader.GetTilemap(parameters.Tilemap);
		if(!originalMap) {
			console.log('unable to find tilemap ', parameters.Tilemap);
			return false;
		}

		tileset = Nova.Loader.GetImage(originalMap.image.split(".")[0]);
		if(!tileset) return false;
		tilesetSize = new Nova.System.Vector2(tileset.width, tileset.height);

		this.data = originalMap.data;
		this.Size = new Nova.System.Vector2(originalMap.width, originalMap.height);
		this.TileSize = new Nova.System.Vector2(originalMap.tileWidth, originalMap.tileHeight);

		this.canvas.width = tilesetSize.X * this.TileSize.X;
		this.canvas.height = tilesetSize.Y * this.TileSize.Y;

		this.DrawTilemap();

		return true;
	}
	
	this.Update = function() {
		var Transform = this.Owner.GetComponent('Transform');

		var DrawPosition = Transform.GetWorldOrigin();
		if(this.drawAtInteger) DrawPosition.Set(Math.round(DrawPosition.X), Math.round(DrawPosition.Y));
		// console.log(DrawPosition);

		Nova.ctx.save();
		Nova.Viewport.Apply();
		Nova.ctx.translate(Transform.Position.X, Transform.Position.Y);
		Nova.ctx.rotate(Transform.GetAngle());
		Nova.ctx.translate(-Transform.Position.X, -Transform.Position.Y);
		Nova.ctx.globalAlpha = this.Alpha;
		Nova.ctx.drawImage(render, DrawPosition.X, DrawPosition.Y, this.canvas.width * Transform.GetScale(), this.canvas.height * Transform.GetScale());
		Nova.ctx.restore();
	}

	this.DrawTilemap = function() {
		for(var i = 0; i < this.data.length; i++) {
			var tile = this.data[i] - 1;
			var drawX = (i % this.Size.X) * this.TileSize.X;
			var drawY = (Math.floor(i / this.Size.Y)) * this.TileSize.Y;
			var tileX = (tile % (tilesetSize.X / this.TileSize.X)) * this.TileSize.X;
			var tileY = (Math.floor(tile / (tilesetSize.X / this.TileSize.X))) * this.TileSize.X;

			this.ctx.drawImage(tileset, tileX, tileY, this.TileSize.X, this.TileSize.Y, drawX, drawY, this.TileSize.X, this.TileSize.Y);
		}
		render.src = this.canvas.toDataURL();
	}

}, true);
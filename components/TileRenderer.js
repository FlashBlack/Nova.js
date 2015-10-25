Nova.NewComponent('TileRenderer', function() {
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');

	this.Create = function(parameters){
		var defaultParameters = {
			Alpha: 1,
			drawAtInteger: false,
			pointFiltering: true,
		}
		parameters = this.System.SetDefaultProperties(parameters, defaultParameters);
		if (!parameters.hasOwnProperty('tilemap')) {
			console.error('You need to pass a tilemap into the TileRenderer!');
			return false;
		}
		this.tilemap = parameters.tilemap;
		this.Alpha = parameters.Alpha;
		this.drawAtInteger = parameters.drawAtInteger;

		this.canvas.width = tilemap.width * 64;
		this.canvas.height = tilemap.height * 64;
		this.ctx.mozImageSmoothingEnabled = !parameters.pointFiltering;
		this.ctx.webkitImageSmoothingEnabled = !parameters.pointFiltering;
		this.ctx.msImageSmoothingEnabled = !parameters.pointFiltering;
		this.ctx.imageSmoothingEnabled = !parameters.pointFiltering;
		this.ctx.imageSmoothingEnabled = !parameters.pointFiltering;

		this.UpdateTilemap();
	}

	
	this.Update = function() {
		// get the entities Transform component
		var Transform = this.Owner.GetComponent('Transform');
		// figure out where to draw it based on Transform.Position and Transform.Anchor
		var drawX = Transform.Position.x - Transform.Anchor.x;
		var drawY = Transform.Position.y - Transform.Anchor.y;
		if(this.drawAtInteger) {
			drawX = Math.round(drawX);
			drawY = Math.round(drawY);
		}
		// draw the image
		Nova.ctx.save();
		Nova.Viewport.Apply();
		Nova.ctx.globalAlpha = this.Alpha;
		Nova.ctx.drawImage(this.canvas, drawX, drawY, this.canvas.width * Transform.GetScale(), this.canvas.height * Transform.GetScale());
		Nova.ctx.globalAlpha = 1;
		Nova.ctx.restore();
		
	}

	this.UpdateTilemap = function(){
		tilemap.layers.forEach(function(layer){
			for (var i=0;i<layer.width;i++){
				for (var j=0;j<layer.height;j++){
					var tileset = new Image();
					tileset.src = tilemap.tilesets[0].image,
					this.context.drawImage(tileset,
										   layer.data[(j*tilemap.width)+i]*tilemap.tilewidth - tilemap.tileheight,
										   0,
										   tilemap.tilesets[0].tilewidth,
										   tilemap.tilesets[0].tileheight,
										   i*64,
										   j*64,
										   64,
										   64);
				}
			}
		};
	}
/*		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		var rawTilemap = Game.load.tilemap({ 
			src:'Tilemaps/Test/Test.json',
			onload: function(){
				var tilemap = JSON.parse(rawTilemap.responseText);

				this.canvas.width = tilemap.width * 64;
				this.canvas.height = tilemap.height * 64;
				this.context.mozImageSmoothingEnabled = false;
				this.context.webkitImageSmoothingEnabled = false;
				this.context.msImageSmoothingEnabled = false;
				this.context.imageSmoothingEnabled = false;
				this.context.imageSmoothingEnabled = false;

				TEST = tilemap

				tilemap.layers.forEach(function(layer){
					for (var i=0;i<layer.width;i++){
						for (var j=0;j<layer.height;j++){
							var tileset = new Image();
							tileset.src = tilemap.tilesets[0].image,
							this.context.drawImage(tileset,
												   layer.data[(j*tilemap.width)+i]*tilemap.tilewidth - tilemap.tileheight,
												   0,
												   tilemap.tilesets[0].tilewidth,
												   tilemap.tilesets[0].tileheight,
												   i*64,
												   j*64,
												   64,
												   64);
							
						}
					}
				}.bind(this));
			}.bind(this),
		});*/

}, true);
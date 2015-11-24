define([
	'Nova/Entity/Entity',
	'Nova/System',
], function(Entity, System){
	
	var Sprite = Entity.extend({
		
		init: function(properties){
			if(typeof properties.Sprite === "undefined") properties.Sprite = {};
			
			this._super(properties, ['hasCollider']);
			
			this.canUpdate = false;
			
			var spriteName = properties.Sprite.Image.split('.');
			spriteName.splice(spriteName.length - 1, 1);
			spriteName = spriteName.join('.');
			
			this.gfx = new PIXI.Graphics();
			this.drawBounds = properties.Sprite.DrawBounds || false;
			
			// reset loader cache to allow for laoding a sprite that has already been loaded (easier than trying to check if the resource has already been loaded)
			// this was tested and the sprite is added to the loader on tick #0, and it is also loaded on tick #0 if the resource was included in the Project.json
			PIXI.loader.reset();
			PIXI.loader.add(spriteName, "images/" + properties.Sprite.Image).load(function(loader, resources) {
				this.sprite = new PIXI.Sprite(resources[spriteName].texture);
				this.sprite.anchor = new PIXI.Point(0 || properties.Sprite.Origin.x, 0 || properties.Sprite.Origin.y);
				this.position = properties.Position || new System.vector2();
				this.sprite.position = this.position;
				
				Nova.getStage().addChild(this.sprite);
				this.sprite.addChild(this.gfx);
				this.canUpdate = true;
			}.bind(this));
		},
		
		update: function() {
			this.sprite.position.x = this.position.x;
			this.sprite.position.y = this.position.y;
			
			var bounds = this.sprite.getLocalBounds();
			
			if(this.drawBounds) {
				this.gfx.clear();
				this.gfx.lineStyle(1, 0x00FF00);
				this.gfx.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
			}
		},
		
		toggleDrawCollider: function(state) {
			if(typeof state === "boolean") this.drawBounds = state;
			else this.drawBounds = !this.drawBounds;
			
			if(!this.drawBounds) {
				Nova.getStage().removeChild(this.gfx);
			}
		},
		
		_updatePosition: function() {
			this.sprite.position.x = this.position.x;
			this.sprite.position.y = this.position.y;
		},
		
		// position functions
		setPosition: function(position) {
			this._super(position);
			this._updatePosition();
		},
		setX: function(x) {
			this._super(x);
			this._updatePosition();
		},
		setY: function(y) {
			this._super(y);
			this._updatePosition();
		},
		
		// rotation functions
		setAngle: function(angle) {
			this.sprite.rotation = System.toRadians(parseFloat(angle));
		},
		setRotation: function(rotation) {
			this.sprite.rotation = parseFloat(rotation);
		},
		
		// anchor functions
		setAnchor: function(anchor) {
			if(!anchor.isVector2) return false;
			this.sprite.anchor = anchor;
		},
		setAnchorX: function(x) {
			this.sprite.anchor.x = parseFloat(x);
		},
		setAnchorY: function(y) {
			this.sprite.anchor.y = parseFloat(y);
		},
		
		// sizing functions
		setScale: function(scale) {
			if(!scale.isVector2) return false;
			this.sprite.scale = scale;
		},
		setScaleX: function(x) {
			this.sprite.scale.x = parseFloat(x);
		},
		setScaleY: function(y) {
			this.sprite.scale.y = parseFloat(y);
		},
		setSize: function(size) {
			if(!size.isVector2) return false;
			this.sprite.width = size.x;
			this.sprite.height = size.y;
		},
		setWidth: function(width) {
			this.sprite.width = parseFloat(width);
		},
		setHeight: function(height) {
			this.sprite.height = parseFloat(height);
		},
		
		// visibility functions
		setAlpha: function(alpha) {
			this.sprite.alpha = alpha;
		},
		setVisible: function(visible) {
			this.sprite.renderable = visible;
		},
		toggleVisible: function(visible) {
			this.sprite.renderable = !this.sprite.renderable;
		}
	});
	
	return Sprite;
});

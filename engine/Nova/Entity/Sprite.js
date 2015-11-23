define([
	'Nova/Entity/Entity',
	'Nova/System',
], function(Entity, System){
	
	var Sprite = Entity.extend({
		
		init: function(properties){
			this._super(properties, ['hasCollider']);
			
			var spriteName = properties.Sprite.Image.split('.');
			spriteName.splice(spriteName.length - 1, 1);
			spriteName = spriteName.join('.');
			
			PIXI.loader.add(spriteName, "images/" + properties.Sprite.Image).load(function(loader, resources) {
				this.sprite = new PIXI.Sprite(resources[spriteName].texture);
				Nova.getStage().addChild(this.sprite);
			}.bind(this))
		},
		
		update: function() {
			this.sprite.position.x = this.position.x;
			this.sprite.position.y = this.position.y;
		}
	});
	
	return Sprite;
});

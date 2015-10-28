"use strict";

Nova.CreateBlueprint('Bullet', function() {
	this.requiredComponents = [['Bullet', 'Pre'], ['Transform', 'Post'], ['SpriteRenderer', 'Post'], ['Collider', 'Post']];

	this.Create = function() { }
	this.Update = function() {
		var solids = Nova.getSolids();
		for(var i = 0; i < solids.length; i++) {
			if(Nova.Collision.Overlaps(this.GetComponent("Collider"), solids[i])) {
				console.log('Bullet hit');
			}
		}
	}
})
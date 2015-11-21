"use strict";

Nova.Entities.CreateBlueprint('Bullet', function() {
	this.requiredComponents = [['Bullet', 'Pre'], ['Transform', 'Post'], ['SpriteRenderer', 'Post'], ['Collider', 'Post']];

	this.Create = function() { }

	this.Update = function() {
		var Transform = this.GetComponent("Transform");
		var Collider = this.GetComponent("Collider");

		var solids = Nova.getSolids();
		for(var i = 0; i < solids.length; i++) {
			if(Nova.Collision.Overlaps(Collider, solids[i])) {
				
				Nova.Entities.DestroyEntity(this.GUID);
			}
		}
	}

	this.Destroy = function() {
		console.log('Bullet destroyed');
	}
})
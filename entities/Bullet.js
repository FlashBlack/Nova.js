"use strict";

Nova.CreateBlueprint('Bullet', function() {
	this.requiredComponents = [['Bullet', 'Pre'], ['Transform', 'Post'], ['SpriteRenderer', 'Post'], ['Collider', 'Post']];

	this.Create = function() { }

	this.Update = function() {
		var Transform = this.GetComponent("Transform");
		var Collider = this.GetComponent("Collider");

		// check if bullet is outside layout
		/*var Position = Transform.Position;
		var Screen = Nova.Viewport.GetScreenCollider();

		Nova.Render.Path({
			Path: Screen,
			Complete: true,
			Fill: true
		})

		var subColliders = Collider.GetSubColliders();
		for(var i = 0; i < subColliders.length; i++) {
			if(!Nova.Collision.PolygonCollision(subColliders[i], Screen)) {
				Nova.DestroyEntity(this.GUID);
			}
			
		}*/

		var solids = Nova.getSolids();
		for(var i = 0; i < solids.length; i++) {
			if(Nova.Collision.Overlaps(Collider, solids[i])) {
				Nova.DestroyEntity(this.GUID);
			}
		}
	}

	this.Destroy = function() {
		console.log('Bullet destroyed');
	}
})
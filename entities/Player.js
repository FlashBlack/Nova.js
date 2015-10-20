GCE.CreateBlueprint('Player', function() {
	this.requiredComponents = ['Transform', 'SpriteRenderer', 'Collider'];
	this.Create = function(properties) {
		this.position = data.position;
	}
	this.Update = function() {
		// check collisions
		GCE.NewEntity('Player', {
			position: {
				x: 0,
				y: 0
			}
		})
	}
})
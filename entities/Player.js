GCE.CreateBlueprint('Player', function() {
	this.requiredComponents = ['Transform', 'SpriteRenderer'];
	this.Create = function(properties) {
		console.log('Created Player entity');
	}
	this.Update = function() {
	}
})
Nova.CreateBlueprint('TestMap', function() {
	this.requiredComponents = [['Transform', 'Post'], ['TileRenderer', 'Post']];
	this.Create = function(parameters) {
		this.GetComponent('Transform').SetScale(4);
	}
})
Nova.Debug = new function() {
	var drawColliders = true;
	
	this.toggleColliders = function(state) {
		if(state == undefined) drawColliders = !drawColliders;
		else drawColliders = state;
	}

	this.drawColliders = function() {
		if(!drawColliders) return;
		var solids = Nova.getSolids();
		console.log(solids);
		// for()
	}
}
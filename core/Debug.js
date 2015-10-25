Nova.Debug = new function() {
	var drawColliders = true;
	var debugText = true;
	
	this.toggleColliders = function(state) {
		if(state == undefined) drawColliders = !drawColliders;
		else drawColliders = state;
	}

	this.toggleDebugText = function(state) {
		if(state == undefined) debugText = !debugText;
		else debugText = state;
	}

	this.drawColliders = function() {
		if(!drawColliders) return;
		var solids = Nova.getSolids();
		console.log(solids);
		// for()
	}

	this.Update = function() {
		if(drawColliders) {
			// draw colliders
		}
		if(debugText) {
			Nova.Render.Text({
				Position: new Nova.System.Vector2(5, 3),
				Text: Nova.fps + 'fps',
				Colour: 'lime',
				GUI: true
			})
			Nova.Render.Text({
				Position: new Nova.System.Vector2(5, 20),
				Text: Nova.dt,
				Colour: 'lime',
				GUI: true
			})
		}
	}
}
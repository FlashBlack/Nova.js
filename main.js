var GCE = new function() {
	this.VERSION = '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.1';

	// holds all the instances of entities
	var Entities = {};
	// holds blueprint for each entity
	var EntityBlueprints = {};

	var gameLoop = function() {

		requestAnimationFrame(gameLoop);
	}
	
	this.Start = function(parameters) {
		parameters = SetDefaultParameters(parameters);

		// ensure that a canvas id was passed
		if (!parameters.hasOwnProperty('canvas')) {
			console.error('Canvas ID must be passed!');
			return false; //if no canvas was passed exit early
		} else {
			var canvas = document.getElementById(parameters.canvas)
			if(canvas == undefined) {
				console.error('Invalid Canvas ID!');
				return false;
			} else {
				// finding the canvas was a success
				this.canvas = canvas;
				this.ctx = canvas.getContext('2d');
			}
		}
	}

	function SetDefaultParameters(parameters) {
		var defaultParameters = {};

		for(var p in parameters) {
			var currentParameter = parameters[p];
			if(!defaultParameters.hasOwnProperty(p)) {
				defaultParameters[p] = currentParameter;
			} 
			// if the type matches, set the passed value. else leave as default
			else if(typeof defaultParameters[p] == typeof currentParameter) {
				defaultParameters[p] = currentParameter;
			}
		}
		return defaultParameters;
	}
}
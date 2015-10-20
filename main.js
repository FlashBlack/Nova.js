var GCE = new function() {
	this.VERSION = '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.1';


	// holds all the instances of entities
	var Entities = {};
	// holds blueprint for each entity
	var EntityBlueprints = {};

	var gameLoop = function() {

	}

	
	this.Start = function(parameters) {
		if (!parameters.hasOwnProperty('canvas')) return false; //if no canvas was passed exit early
		if (!parameters.hasOwnProperty('width')) parameters.width = 800; //if nothing was passed, set to defaut
		if (!parameters.hasOwnProperty('height')) parameters.height = 600; //if nothing was passed, set to defaut

		
	}
}
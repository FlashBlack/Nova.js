var GCE = new function() {
	this.VERSION = '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.1';

	// holds all the instances of entities
	var Entities = {};
	var zOrder = [];
	// holds blueprint for each entity
	var EntityBlueprints = {};

	var lastUpdate;

	var gameLoop = function() {
		var now = performance.now();
		this.dt = (now - lastUpdate) / 1000;
		lastUpdate = now;

		console.log(this.dt);
		UpdateEntities();

		requestAnimationFrame(gameLoop);
	}

	this.GenerateGUID = function() {
		function _p8(s) {
        	var p = (Math.random().toString(16)+"000000000").substr(2,8);
        	return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    	}
    	return _p8() + _p8(true) + _p8(true) + _p8();
	}
	
	this.Start = function(parameters) {
		var defaultParameters = {
			frameRate: 60
		};
		parameters = SetDefaultParameters(parameters, defaultParameters);

		// ensure that a canvas id was passed
		if (!parameters.hasOwnProperty('canvas')) {
			console.error('Canvas ID must be passed!');
			return false; //if no canvas was passed exit early
		}
		var canvas = document.getElementById(parameters.canvas);
		if(canvas == undefined) {
			console.error('Invalid Canvas ID!');
			return false;
		} else {
			// finding the canvas was a success
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
		}

		lastUpdate = performance.now();
		requestAnimationFrame(gameLoop);
	}

	this.CreateBlueprint = function(blueprintName, blueprint) {
		EntityBlueprints[blueprintName] = blueprint
	}

	this.CreateEntity = function(entityName, properties) {
		if(EntityBlueprints.hasOwnProperty(entityName)) {
			var newEntity = new EntityBlueprints[entityName];
			newEntity.GUID = this.GenerateGUID();
			newEntity.ENTITY_TYPE = entityName;
			Entities[newEntity.GUID] = newEntity;
			zOrder.push(newEntity.GUID);
			if(typeof newEntity.Create === 'function') { newEntity.Create(properties); }
			// add required components
		}
	}

	function SetDefaultParameters(parameters, defaultParameters) {
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

	function UpdateEntities() {
		// first call currentEntity.Update()
		for(var e in Entities) {
			var currentEntity = Entities[e];
			if(typeof currentEntity.Update === 'function') {
				currentEntity.Update();
			}
		}

		// then update the entities components
		for(var i in zOrder) {
			var currentEntity = Entities[zOrder[i]];
			// update any components
		}
	}
}
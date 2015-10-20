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

	var Class = (function(){
		var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
		function Class(){};
		Class.extend = function(prop) {
			var _super = this.prototype;

			initializing = true;
			var prototype = new this();
			initializing = false;

			for (var name in prop) {
				prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn){
					return function() {
						var tmp = this._super;

						this._super = _super[name];

						var ret = fn.apply(this, arguments);        
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) :
				prop[name];
			}

			function Class() {
				if ( !initializing && this.init )
				this.init.apply(this, arguments);
			}

			Class.prototype = prototype;
			Class.prototype.constructor = Class;
			Class.extend = arguments.callee;

			return Class;
		};
		return Class;
	})();

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

	var baseBlueprint = Class.extend({
		init: function(){
			this.components = {
				transform: GCE.newComponent('Transform'),
			}
		}
		update: function(){
			/*
				loop through components and run them here.
				this way each entity could handle their own
				components? just an idea?
			*/
		}
		addComponent: function(){

		}
	});

	this.CreateBlueprint = function(blueprintName, blueprint) {
		EntityBlueprints[blueprintName] = baseBlueprint.extend(blueprint);
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
var GCE = new function() {
	this.VERSION = '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.1';
	this.ready = false;

	// holds all the instances of entities
	var Entities = {};
	var zOrder = [];
	// holds blueprint for each entity
	var EntityBlueprints = {};
	var Components = {};

	var lastUpdate;

	this.Ready = function() {};

	var gameLoop = function() {
		var now = performance.now();
		this.dt = (now - lastUpdate) / 1000;
		lastUpdate = now;

		GCE.ctx.fillStyle = 'black';
		GCE.ctx.fillRect(0, 0, GCE.canvas.width, GCE.canvas.height);

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

	this.init = function() {
		this.Ready();
		lastUpdate = performance.now();
		requestAnimationFrame(gameLoop);
	}
	
	this.Start = function(parameters) {
		var defaultParameters = {
			sprites: [],
			entities: []
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
			this.ctx.fillStyle = 'black';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}

		this.Loader.LoadSprites(parameters.sprites);
		this.Loader.LoadEntities(parameters.entities);

		// lastUpdate = performance.now();
		// requestAnimationFrame(gameLoop);
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
			newEntity.Components = {};
			newEntity.AddComponent = function(componentName, componentType, properties) {
				var newComponent = GCE.GetComponent(componentType, properties);
				if(newComponent) {
					newEntity.Components[componentName] = newComponent;
					return true;
				}
				return false;
			}
			newEntity.GetComponent = function(componentName) {
				if(this.Components.hasOwnProperty(componentName)) return this.Components[componentName];
				return false;
			}
			if(newEntity.hasOwnProperty('requiredComponents')) {
				for(var i in newEntity.requiredComponents) {
					var currentComponent = newEntity.requiredComponents[i];
					
					var componentProperties = {};
					if(properties.hasOwnProperty(currentComponent)) { componentProperties = properties[currentComponent]; }
					
					var newComponent = this.GetComponent(currentComponent, componentProperties, newEntity.GUID);
					if(newComponent) { newEntity.Components[currentComponent] = newComponent; }
				}
			}
			return newEntity.GUID;
		}
		return false;
	}

	this.NewComponent = function(componentName, component, cantOverwrite) {
		if(Components.hasOwnProperty(componentName)) {
			if(Components[componentName].hasOwnProperty('cantOverwrite')) {
				console.error('Cant overwrite component \'' + componentName + '\'')
				return false;
			}
		}
		if(cantOverwrite) component.cantOverwrite = true;
		Components[componentName] = component;
	}

	this.GetComponent = function(componentName, properties, GUID) {
		if(Components.hasOwnProperty(componentName)) {
			var newComponent = new Components[componentName];
			if(GUID) { newComponent.Owner = this.GetEntityByID(GUID); }
			if(!newComponent.hasOwnProperty('Create')) { newComponent.Create = function() {} }
			if(!newComponent.hasOwnProperty('Update')) { newComponent.Update = function() {} }
			newComponent.Create(properties);
			return newComponent;
		}
		return false;
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
			for(var e in currentEntity.Components) {
				currentEntity.Components[e].Update();
			}
		}
	}

	this.Loader = new function() {
		var loaded = 0;
		var toLoad = 0;
		var Images = {};
		var Sprites = {};
		var LoadedImages = {};
		var scriptsToLoad = 0;
		var scriptsLoaded = 0;
		var spritesToLoad, entitiesToLoad;

		var requiredScripts = ['http://code.jquery.com/jquery-1.11.3.min.js', 'http://requirejs.org/docs/release/2.1.20/minified/require.js']
		for(var i in requiredScripts) {
			var newScript = document.createElement('script');
			newScript.src = requiredScripts[i];
			scriptsToLoad++;
			newScript.onload = function() {
				GCE.Loader.LoadScript();
			}
			document.getElementsByTagName('head')[0].appendChild(newScript);
		}

		this.LoadObject = function() {
			loaded++;
			if(loaded >= toLoad) GCE.init();
		};

		var BeginLoad = function() {
			// load the sprites
			for(var i in spritesToLoad) {
				var currentSprite = spritesToLoad[i];
				toLoad++;
				$.getJSON('sprites/' + currentSprite + '.json', function(data) {
					console.log(data);
					var sprite = data.image.split('.')[0];
					GCE.Loader.LoadImage(sprite, data.image);
					Sprites[data.spriteName] = data;
					GCE.Loader.LoadObject();
				})
			}
			// load the entities
			for(var i in entitiesToLoad) {
				var currentEntity = entitiesToLoad[i];
				toLoad++;
				require(['entities/' + currentEntity], function() { GCE.Loader.LoadObject(); })
			}
		}

		this.LoadImage = function(name, file) {
			if(!LoadedImages.hasOwnProperty(name)) {
				toLoad++;
				var tempImage = new Image();
				tempImage.src = 'images/' + file;
				tempImage.onload = function() {
					Images[name] = this;
					GCE.Loader.LoadObject();
				}
			}
		};

		this.LoadSprites = function(sprites) {
			spritesToLoad = sprites;
		};

		this.LoadEntities = function(entities) {
			entitiesToLoad = entities;
		}

		this.LoadScript = function() {
			scriptsLoaded++;
			if(scriptsLoaded >= scriptsToLoad) BeginLoad();
		}

		this.GetImage = function(image) {
			// get image name from sprite if a sprite is passed
			if(typeof image === 'object') { image = image.image.split('.')[0]};
			if(Images.hasOwnProperty(image)) return Images[image];
			return false;
		};

		this.GetSprite = function(sprite) {
			if(Sprites.hasOwnProperty(sprite)) return Sprites[sprite];
			return false;
		};
	}

	this.GetEntityByID = function(ID) {
		if(Entities.hasOwnProperty(ID)) return Entities[ID];
		return false;
	}

	this.GetEntities = function(entityType, callback) {
		return Entities;
	}

	this.GetBlueprints = function() {
		return EntityBlueprints;
	}
}

GCE.NewComponent('Transform', function() {
	this.Position = {
		x: 0,
		y: 0
	}
	this.Anchor = {
		x: 0,
		y: 0
	}
	this.Create = function(properties) {
		if(properties == undefined) return false;
		if(properties.hasOwnProperty('Position')) {
			this.Position.x = properties.Position.x;
			this.Position.y = properties.Position.y;
		}
		if(properties.hasOwnProperty('Anchor')) {
			this.Anchor.x = properties.Anchor.x,
			this.Anchor.y = properties.Anchor.y
		}
	}
	this.SetPosition = function(x, y) {
		this.Position.x = x;
		this.Position.y = y;
	}
}, true)

GCE.NewComponent('SpriteRenderer', function() {
	this.Create = function(properties) {
		this.sprite = GCE.Loader.GetSprite(properties.sprite);
		this.img = GCE.Loader.GetImage(this.sprite);
		if(properties.hasOwnProperty('animation')) { this.currentAnimation = properties.animation }
		else { this.currentAnimation = Object.keys(this.sprite.animations)[0]; }
	}

	this.Update = function() {
		var Transform = this.Owner.GetComponent('Transform');
		var drawX = Transform.Position.x + Transform.Anchor.x * -1;
		var drawY = Transform.Position.y + Transform.Anchor.y * -1;
		var frame = this.GetFrame();
		GCE.ctx.drawImage(this.img, frame.x, frame.y, frame.width, frame.height, drawX, drawY, frame.width, frame.height);
	}

	this.GetFrame = function() {
		return this.sprite.animations[this.currentAnimation][0];
	}
}, true)
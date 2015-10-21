var GCE = new function() {
	this.VERSION = '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.1';

	// becomes true when all assets are loaded, and GCE.Ready() is called
	var isReady = false;
	this.isReady = function() { return isReady; };

	this.System = new function() {
		this.angleTowards = function(x1, y1, x2, y2) {
			var dx = x2 - x1;
			var dy = y2 - y1;
			return Math.atan2(dy, dx) * 180 / Math.PI;
		}
		this.distance = function(x1, y1, x2, y2) {
			var dx = x2 - x1;
			var dy = y2 - y1;
			return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		}
	}

	// holds all the instances of entities
	var Entities = {};
	// order for entity component updates. these are updated after all entities are updated
	var zOrder = [];
	// holds blueprint for each entity
	var EntityBlueprints = {};
	// blueprints for components
	var Components = {};

	this.Ready = function() {};

	// time of last update, used for deltatime
	var lastUpdate;
	var gameLoop = function() {
		var now = performance.now();
		this.dt = (now - lastUpdate) / 1000;
		lastUpdate = now;

		// fill canvas with background colour
		GCE.ctx.fillStyle = 'black';
		GCE.ctx.fillRect(0, 0, GCE.canvas.width, GCE.canvas.height);

		// update all entities
		UpdateEntities();

		// do loop again
		requestAnimationFrame(gameLoop);
	}

	this.GenerateGUID = function() {
		function _p8(s) {
        	var p = (Math.random().toString(16)+"000000000").substr(2,8);
        	return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    	}
    	return _p8() + _p8(true) + _p8(true) + _p8();
	}

	// this is the last function to be called for ready state, it actually starts the loop adter calling GCE.Ready()
	this.init = function() {
		isReady = true;
		this.Ready();
		lastUpdate = performance.now();
		requestAnimationFrame(gameLoop);
	}
	
	// used to setup GCE sprites, entities, components, images, parameters, etc.
	this.Start = function(parameters) {
		// required parameters
		var defaultParameters = {
			sprites: [],
			entities: []
		};
		// get default parameters if something is missing
		parameters = SetDefaultParameters(parameters, defaultParameters);

		// ensure that a canvas id was passed
		if (!parameters.hasOwnProperty('canvas')) {
			console.error('Canvas ID must be passed!');
			return false; //if no canvas was passed exit early
		}

		// ensure the passed ID exists
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
			// draw loading bar here?
		}

		// add passed sprites to loadqueue
		this.Loader.LoadSprites(parameters.sprites);
		// add passed entities to loadqueue
		this.Loader.LoadEntities(parameters.entities);
	}

	this.CreateBlueprint = function(blueprintName, blueprint) {
		EntityBlueprints[blueprintName] = blueprint;
	}

	this.CreateEntity = function(entityName, properties) {
		// ensure the blueprint exists
		if(EntityBlueprints.hasOwnProperty(entityName)) {
			// assign created instance to a temporary variable
			var newEntity = new EntityBlueprints[entityName];
			// assign its GUID and ENTITY_TYPE
			newEntity.GUID = this.GenerateGUID();
			newEntity.ENTITY_TYPE = entityName;
			
			// add created entity to Entities object
			Entities[newEntity.GUID] = newEntity;
			// add created entities GUID to zOrder array
			zOrder.push(newEntity.GUID);
			// call the entities create function if it has one, passing the properties
			if(typeof newEntity.Create === 'function') { newEntity.Create(properties); }

			// add required components
			newEntity.Components = {};
			
			// used to add new components to an entity
			newEntity.AddComponent = function(componentName, componentType, properties) {
				// get a new entity of the required type, passing the properties for the Component.Create() function
				var newComponent = GCE.GetComponent(componentType, properties);
				// if a new component was created, add it to the entity
				if(newComponent) {
					newEntity.Components[componentName] = newComponent;
					return true;
				}
				return false;
			}

			// used to get a existing component on an entity
			newEntity.GetComponent = function(componentName) {
				if(this.Components.hasOwnProperty(componentName)) return this.Components[componentName];
				return false;
			}

			// add any required components that are stated int he blueprint
			if(newEntity.hasOwnProperty('requiredComponents')) {
				for(var i in newEntity.requiredComponents) {
					var currentComponent = newEntity.requiredComponents[i];
					
					// get component properties from the entity properties if they exist
					var componentProperties = {};
					if(properties.hasOwnProperty(currentComponent)) { componentProperties = properties[currentComponent]; }
					
					// get the new component passing the properties and entity GUID for Component.Owner
					var newComponent = this.GetComponent(currentComponent, componentProperties, newEntity.GUID);
					// add the component if it was created successfully
					if(newComponent) { newEntity.Components[currentComponent] = newComponent; }
				}
			}
			// return the entities GUID
			return newEntity.GUID;
		}
		return false;
	}

	// used to create a new blueprint for a component
	this.NewComponent = function(componentName, component, cantOverwrite) {
		// ensure that it does not overwrite any components with the cantOverwrite property
		if(Components.hasOwnProperty(componentName)) {
			if(Components[componentName].hasOwnProperty('cantOverwrite')) {
				console.error('Cant overwrite component \'' + componentName + '\'')
				return false;
			}
		}
		// set the cantOverwrite property if necessary
		if(cantOverwrite) component.cantOverwrite = true;
		// add the new component to Components object
		Components[componentName] = component;
	}

	// used to create and return a new component
	this.GetComponent = function(componentName, properties, GUID) {
		// ensure the component type exists
		if(Components.hasOwnProperty(componentName)) {
			// create the new component
			var newComponent = new Components[componentName];
			// if a GUID was passed, assign that entity to newComponent.Owner
			if(GUID) { newComponent.Owner = this.GetEntityByID(GUID); }
			// ensure a Create and Update function exists
			if(!newComponent.hasOwnProperty('Create')) { newComponent.Create = function() {} }
			if(!newComponent.hasOwnProperty('Update')) { newComponent.Update = function() {} }
			// call newComponent.Create() passing in the component properties
			newComponent.Create(properties);
			// return the created component
			return newComponent;
		}
		return false;
	}

	// used to ensure that 
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

		// adds a script tag to head for required libraries
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

		// initialize GCE if the last object has been loaded. note: this does not include scripts
		this.LoadObject = function() {
			loaded++;
			if(loaded >= toLoad) GCE.init();
		};

		var BeginLoad = function() {
			// load the sprites
			for(var i in spritesToLoad) {
				var currentSprite = spritesToLoad[i];
				toLoad++;
				// grab the sprite json from sprites/ folder and load it in
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
			// dont load the image if it has already been loaded, this allows multiple sprites to use the same image
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
			// assign the sprites array to spritesToLoad for loading later (after scripts)
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

	// REMOVE LATER these are for debug purposes
	this.GetEntities = function(entityType, callback) {
		return Entities;
	}

	this.GetBlueprints = function() {
		return EntityBlueprints;
	}
}

/*
~~~~~~~~~~~~~~~~~~~~
|  				   |
|	 COMPONENTS    |
|				   |
~~~~~~~~~~~~~~~~~~~~
*/

GCE.NewComponent('Transform', function() {
	// default values
	this.Position = {
		x: 0,
		y: 0
	}
	this.Anchor = {
		x: 0,
		y: 0
	}
	this.Create = function(properties) {
		// dont do anything if no properties were passed
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
	this.drawAtInteger = false;
	this.Create = function(properties) {
		this.sprite = GCE.Loader.GetSprite(properties.sprite);
		this.img = GCE.Loader.GetImage(this.sprite);
		if(properties.hasOwnProperty('drawAtInteger')) { this.drawAtInteger = properties.drawAtInteger; }
		if(properties.hasOwnProperty('animation')) { this.currentAnimation = properties.animation }
		else { this.currentAnimation = Object.keys(this.sprite.animations)[0]; }
	}

	this.Update = function() {
		// get the entities Transform component
		var Transform = this.Owner.GetComponent('Transform');
		// figure out where to draw it based on Transform.Position and Transform.Anchor
		var drawX = Transform.Position.x + Transform.Anchor.x * -1;
		var drawY = Transform.Position.y + Transform.Anchor.y * -1;
		if(this.drawAtInteger) {
			drawX = Math.round(drawX);
			drawY = Math.round(drawY);
		}
		var frame = this.GetFrame();
		// draw the image
		GCE.ctx.drawImage(this.img, frame.x, frame.y, frame.width, frame.height, drawX, drawY, frame.width, frame.height);
	}

	this.GetFrame = function() {
		return this.sprite.animations[this.currentAnimation][0];
	}
}, true)
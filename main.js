var GCE = new function() {
	this.VERSION = '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.1';

	// becomes true when all assets are loaded, and GCE.Ready() is called
	var isReady = false;
	this.isReady = function() { return isReady; };

	// general functions and values
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
		this.rotateAround = function(pointX, pointY, originX, originY, angle) {
			angle = (angle * (Math.PI / 180.0)) * -1;
			pointX++;
			pointY++;
			originX++;
			originY++;
		    return {
		        x: (Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX) - 1,
		        y: (Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY) - 1
		    };
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
		GCE.ctx.fillStyle = 'grey';
		GCE.ctx.fillRect(0, 0, GCE.canvas.width, GCE.canvas.height);

		// update all entities
		UpdateEntities();

		GCE.Input.UpdateKeys();

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

		if(parameters.hasOwnProperty('jQueryIncluded') && parameters.jQueryIncluded) { this.Loader.BeginLoad(); }
		else { LoadJQuery() }
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

			newEntity.RemoveComponent = function(componentName){
				if (newEntity.Components.hasOwnProperty(componentName)){
					delete newEntity.Components[componentName];
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

	function LoadJQuery() {
		var newScript = document.createElement('script');
		newScript.src = 'http://code.jquery.com/jquery-1.11.3.min.js'
		newScript.onload = function() {
			GCE.Loader.BeginLoad();
		}
		document.getElementsByTagName('head')[0].appendChild(newScript);
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

		// initialize GCE if the last object has been loaded. note: this does not include scripts
		this.LoadObject = function() {
			loaded++;
			if(loaded >= toLoad) GCE.init();
		};

		this.BeginLoad = function() {
			GCE.Input.Setup();
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
				// require(['entities/' + currentEntity], function() { GCE.Loader.LoadObject(); })
				$.ajax({
					url: 'entities/' + currentEntity + '.js',
					dataType: 'script',
					success: GCE.Loader.LoadObject,
				})
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
			if(scriptsLoaded >= scriptsToLoad) this.BeginLoad();
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

	this.Input = new function() {
		var keyCodes = {"BACK": 8, "TAB": 9, "ENTER": 13, "SHIFT": 16, "CTRL": 17, "ALT": 18, "BREAK": 19, "CAPS": 20, "ESCAPE": 27, "SPACE": 32, "PGUP": 33, "PGDOWN": 34, "END": 35, "HOME": 36, "LEFT": 37, "UP": 38, "RIGHT": 39, "DOWN": 40, "INSERT": 45, "DELETE": 46, 
		"0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57,
		"A": 65, "B": 66, "C": 67, "D": 68, "E": 69, "F": 70, "G": 71, "H": 72, "I": 73, "J": 74, "K": 75, "L": 76, "M": 77, "N": 78, "O": 79, "P": 80, "Q": 81, "R": 82, "S": 83, "T": 84, "U": 85, "V": 86, "W": 87, "X": 88, "Y": 89, "Z": 90,
		"LEFTWINDOW": 91, "RIGHTWINDOW": 92, "SELECT": 93, "NUM0": 96, "NUM1": 97, "NUM2": 98, "NUM3": 99, "NUM4": 100, "NUM5": 101, "NUM6": 102, "NUM7": 103, "NUM8": 104, "NUM9": 105, "MULTIPLY": 106, "ADD": 107, "SUBTRACT": 109, "DECIMAL": 110, "DIVIDE": 111,
		"F1": 112, "F2": 113, "F3": 114, "F4": 115, "F5": 116, "F6": 117, "F7": 118, "F8": 119, "F9": 120, "F10": 121, "F11": 122, "F12": 123, "NUMLOCK": 144, "SCROLLLOCK": 145, "COLON": 186, "EQUALS": 187, "COMMA": 188,
		"DASH": 189, "PERIOD": 190, "SLASH": 191, "TILDE": 192, "OPENBRACKET": 219, "BACKSLASH": 220, "CLOSEBRACKET": 221, "APOSTROPHE": 222
		};
		
		var charCodes = [];
		var keys = {};
		var pressed = {};
		var released = {};
		for(var key in keyCodes) {
			charCodes[keyCodes[key]] = key;
			keys[key] = false;
			pressed[key] = false;
			released[key] = false;
		}

		this.Setup = function() {
			$(window).bind('keydown', function(e) {
				var keyCode = e.keyCode || e.which;
				var charCode = charCodes[keyCode];
				if(!keys[charCode]) { pressed[charCode] = true;	}
				keys[charCode] = true;
			})
			$(window).bind('keyup', function(e) {
				var keyCode = e.keyCode || e.which;
				var charCode = charCodes[keyCode];
				released[charCode] = true;
				keys[charCode] = false;
			})
		}

		this.UpdateKeys = function() {
			for(var key in keys) {
				pressed[key] = false;
				released[key] = false;
			}
		}

		this.KeyDown = function(key) {
			if(typeof key === 'number') key = charCodes[key];
			if(keys[key]) return true;
			return false;
		}

		this.KeyPress = function(key) {
			if(typeof key === 'number') key = charCodes[key];
			if(pressed[key]) return true;
			return false;
		}

		this.KeyUp = function(key) {
			if(typeof key === 'number') key = charCodes[key];
			if(released[key]) return true;
			return false;
		}
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
	var origin = {
		x: 0,
		y: 0
	}
	this.Anchor = {
		x: 0,
		y: 0
	}
	this.scale = 1;
	this.Rotation = 0;
	this.Create = function(properties) {
		// dont do anything if no properties were passed
		if(properties == undefined) return false;
		if(properties.hasOwnProperty('Position')) {
			this.Position.x = properties.Position.x;
			this.Position.y = properties.Position.y;
		}
		if(properties.hasOwnProperty('Anchor')) {
			origin.x = properties.Anchor.x,
			origin.y = properties.Anchor.y
			this.Anchor.x = properties.Anchor.x,
			this.Anchor.y = properties.Anchor.y
		}
	}
	this.SetPosition = function(x, y) {
		this.Position.x = x;
		this.Position.y = y;
	}
	this.SetScale = function(newScale) {
		this.scale = newScale;
		this.Anchor.x = origin.x * newScale;
		this.Anchor.y = origin.y * newScale;
	}
	this.SetAngle = function(newAngle) {
		if(newAngle > 0) newAngle = 360 - newAngle;
		var newOrigin = GCE.System.rotateAround(-origin.x, -origin.y, 0, 0, newAngle*-1);
		this.Rotation = newAngle % 360;
		this.Anchor.x = -newOrigin.x;
		this.Anchor.y = -newOrigin.y;
	}
}, true);

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
		var drawX = Transform.Position.x - Transform.Anchor.x;
		var drawY = Transform.Position.y - Transform.Anchor.y;
		if(this.drawAtInteger) {
			drawX = Math.round(drawX);
			drawY = Math.round(drawY);
		}
		var frame = this.GetFrame();
		// draw the image
		GCE.ctx.save();
		GCE.ctx.translate(drawX, drawY);
		GCE.ctx.rotate(Transform.Rotation * Math.PI / 180);
		GCE.ctx.translate(-drawX, -drawY);
		GCE.ctx.drawImage(this.img, frame.x, frame.y, frame.width, frame.height, drawX, drawY, frame.width, frame.height);
		GCE.ctx.restore();
		GCE.ctx.fillStyle = 'red';
		GCE.ctx.fillRect(Transform.Position.x - 1, Transform.Position.y - 1, 2, 2);
		GCE.ctx.fillStyle = 'lime';
		GCE.ctx.fillRect(drawX - 1, drawY - 1, 2, 2);
	}

	this.GetFrame = function() {
		return this.sprite.animations[this.currentAnimation][0];
	}
}, true);
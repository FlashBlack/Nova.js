var Nova = new function() {
	this.VERSION = '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.2';

	// becomes true when all assets are loaded, and Nova.Ready() is called
	var isReady = false;
	var started = false;
	this.isReady = function() { return isReady; };

	// holds all the instances of entities
	var Entities = {};
	// order for entity component updates. these are updated after all entities are updated
	var zOrder = [];
	// holds blueprint for each entity
	var EntityBlueprints = {};
	// blueprints for components
	var Components = {};
	var Solids = [];

	this.Ready = function() {};
	this.dt = 0;

	// time of last update, used for deltatime
	var lastUpdate;
	var gameLoop = function() {
		var now = performance.now();
		Nova.dt = (now - lastUpdate) / 1000;
		Nova.fps = Math.round(1 / Nova.dt);
		lastUpdate = now;

		// fill canvas with background colour
		Nova.ctx.fillStyle = 'grey';
		Nova.ctx.fillRect(0, 0, Nova.canvas.width, Nova.canvas.height);

		// update all entities
		UpdateEntities();

		Nova.ctx.textBaseline = 'top';
		Nova.ctx.fillStyle = 'lime';
		Nova.ctx.font = '16px Georgia';
		Nova.ctx.fillText(Nova.fps, 5, 5);
		Nova.ctx.fillText(Nova.dt, 5, 21);

		Nova.Input.UpdateInput();

		// do loop again
		requestAnimationFrame(gameLoop);
	}

	// this is the last function to be called for ready state, it actually starts the loop adter calling Nova.Ready()
	this.init = function() {
		isReady = true;
		this.Ready();
		lastUpdate = performance.now();
		requestAnimationFrame(gameLoop);
		this.init = function() { console.warn('The game has already been initialized!')}
	}
	
	// used to setup Nova sprites, entities, components, images, parameters, etc.
	this.Start = function(parameters) {
		// required parameters
		var defaultParameters = {
			sprites: [],
			entities: [],
			sounds: [],
			pointFiltering: true,
		};
		// get default parameters if something is missing
		parameters = this.System.SetDefaultProperties(parameters, defaultParameters);

		// ensure that a canvas id was passed
		if (!parameters.hasOwnProperty('canvas')) {
			console.error('Canvas ID must be passed!');
			return false; //if no canvas was passed exit early
		}

		if(parameters.hasOwnProperty('directories')) {
			var dirs = parameters.directories;
			this.Loader.SetDirectory('entities', dirs.entities);
			this.Loader.SetDirectory('components', dirs.components);
			this.Loader.SetDirectory('sprites', dirs.sprites);
			this.Loader.SetDirectory('images', dirs.images);
			this.Loader.SetDirectory('audio', dirs.audio);
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

		Nova.ctx.mozImageSmoothingEnabled = !parameters.pointFiltering;
		Nova.ctx.webkitImageSmoothingEnabled = !parameters.pointFiltering;
		Nova.ctx.msImageSmoothingEnabled = !parameters.pointFiltering;
		Nova.ctx.imageSmoothingEnabled = !parameters.pointFiltering;
		Nova.ctx.imageSmoothingEnabled = !parameters.pointFiltering;

		this.Viewport.Size.Set(this.canvas.width, this.canvas.height);
		this.Render.SetContext(this.ctx);
		// add passed sprites to loadqueue
		this.Loader.LoadSprites(parameters.sprites);
		// add passed entities to loadqueue
		this.Loader.LoadEntities(parameters.entities);
		// add passed sounds to loadqueue
		this.Loader.LoadSounds(parameters.sounds);

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
			newEntity.GUID = this.System.GenerateGUID();
			newEntity.ENTITY_TYPE = entityName;
			
			// add created entity to Entities object
			Entities[newEntity.GUID] = newEntity;
			// add created entities GUID to zOrder array
			zOrder.push(newEntity.GUID);
			// call the entities create function if it has one, passing the properties
			if(typeof newEntity.Create === 'function') newEntity.Create(properties);
			if(!newEntity.hasOwnProperty('Update')) newEntity.Update = function() { };

			// add required components
			newEntity.Components = {};
			newEntity.PreUpdate = [];
			newEntity.PostUpdate = [];
			
			// used to add new components to an entity
			newEntity.AddComponent = function(componentName, componentType, updateType, properties) {
				// get a new entity of the required type, passing the properties for the Component.Create() function
				var newComponent = Nova.GetComponent(componentName, componentType, properties, this.GUID);
				if(!newComponent) return false;
				// if a new component was created, add it to the entity
				if(newComponent) {
					newComponent.componentName = componentName;
					switch(updateType) {
						case 'PRE':
							this.PreUpdate.push(componentName);
							break;
						case 'POST':
							this.PostUpdate.push(componentName);
							break;
					}
					this.Components[componentName] = newComponent;
					return true;
				}
				return false;
			}

			newEntity.RemoveComponent = function(componentName){
				if(this.Components.hasOwnProperty(componentName)) {
					delete this.Components[componentName];
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
					var currentComponent = newEntity.requiredComponents[i][0];
					var componentUpdateType = newEntity.requiredComponents[i][1].toUpperCase();
					
					// get component properties from the entity properties if they exist
					var componentProperties = {};
					if(properties.hasOwnProperty(currentComponent)) { componentProperties = properties[currentComponent]; }
					
					// get the new component passing the properties and entity GUID for Component.Owner
					var newComponent = this.GetComponent(currentComponent, currentComponent, componentProperties, newEntity.GUID);
					if(!newComponent) return false;
					// add the component if it was created successfully
					if(newComponent) {
						newComponent.componentName = currentComponent;
						switch(componentUpdateType) {
							case 'PRE':
								newEntity.PreUpdate.push(currentComponent);
								break;
							case 'POST':
								newEntity.PostUpdate.push(currentComponent);
								break;
						}
						newEntity.Components[currentComponent] = newComponent;
					}
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
	this.GetComponent = function(componentName, componentType, properties, GUID) {
		// ensure the component type exists
		if(Components.hasOwnProperty(componentType)) {
			// create the new component
			var newComponent = new Components[componentType];
			newComponent.componentName = componentName;
			// if a GUID was passed, assign that entity to newComponent.Owner
			if(GUID) { newComponent.Owner = this.GetEntityByID(GUID); }
			// ensure a Create and Update function exists
			if(!newComponent.hasOwnProperty('Create')) { newComponent.Create = function() { return true; } }
			if(!newComponent.hasOwnProperty('Update')) { newComponent.Update = function() {} }
			// call newComponent.Create() passing in the component properties
			var created = newComponent.Create(properties);
			if(!created) {
				console.error('Failed to create component \'' + componentName + '\' on entity \'' + GUID + '\'');
				return false;
			}
			// return the created component
			return newComponent;
		}
		return false;
	}

	function UpdateEntities() {

		var postUpdates = [];

		for(var i in zOrder) {
			var currentEntity = Entities[zOrder[i]];
			for(var j in currentEntity.PreUpdate) {
				currentEntity.Components[currentEntity.PreUpdate[j]].Update();
			}
			for(var k in currentEntity.PostUpdate) {
				postUpdates.push([currentEntity.GUID, currentEntity.PostUpdate[k]]);
			}
		}

		Nova.System.loopThroughObject(Entities, function(GUID, Entity){
			Entity.Update();
		});
		
		// then update the entities components
		for(var i in postUpdates) {
			Nova.GetEntityByID(postUpdates[i][0]).GetComponent(postUpdates[i][1]).Update();
		}
	}

	function LoadJQuery() {
		var newScript = document.createElement('script');
		newScript.src = 'http://code.jquery.com/jquery-1.11.3.min.js'
		newScript.onload = function() {
			Nova.Loader.BeginLoad();
		}
		document.getElementsByTagName('head')[0].appendChild(newScript);
	}

	this.addSolid = function(solid) {
		Solids.push(solid);
	}

	this.getSolids = function() {
		return Solids;
	}

	this.Collides = function(collider1, collider2, offset1, offset2) {
		if(offset1 != undefined) {
			collider1.bboxleft += offset1.x;
			collider1.bboxright += offset1.x;
			collider1.bboxtop+= offset1.y;
			collider1.bboxbottom += offset1.y;
		}
		if(offset2 != undefined) {
			collider2.bboxleft += offset2.x;
			collider2.bboxright += offset2.x;
			collider2.bboxtop+= offset2.y;
			collider2.bboxbottom += offset2.y;
		}

		return (collider1.bboxleft < collider2.bboxright &&
				collider1.bboxright > collider2.bboxleft &&
				collider1.bboxtop < collider2.bboxbottom &&
				collider1.bboxbottom > collider2.bboxtop);
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

var COLON = console;
COLON.insert = function(){
	console.log("                   ____\n"+
"              /  /'    `\\  \\\n"+
"              \\ (   )(   ) /\n"+
"               \\{~~~~~~~~}/\n"+
"                {   /\\   }\n"+
"                {  }  {  }\n"+
"               {  }    {  }\n"+
"              {- }      { -}\n"+
"             _| |        | |_\n"+
"             \\[ ]        [ ]/"
	);
}
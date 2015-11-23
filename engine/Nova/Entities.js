define(['Nova/System'], function(System) {
	var Global = {};
	
	var entities = {},
		blueprints = {},
		objects = {},
		entityTypes = {},
		components = {};
		requiredEntities = [];
	
	/*var requiredObjects = ['TestObject'];
	this.loadObjects = function() {
		// require the next object
		require(['objects/' + requiredObjects[0]], function(object) {
			objects[requiredObjects[0]] = object.init;
			requiredObjects.shift();
			// call this function again if there is another object to be loaded
			if(requiredObjects.length > 0) loadObject();
		})
	}*/
	
	Global.updateEntities = function() {
		for(var e in entities) {
			var currentEntity = entities[e];
			
			currentEntity.update();
		}
	}
	
	Global.getEntityBlueprints = function() {
		requiredEntities = Nova.getProject().Entities;
		
		for(var i = 0; i < requiredEntities.length; i++) {
			requiredEntities[i] = "entities/" + requiredEntities[i];
		}
		
		require(requiredEntities, function() {
			for(var i = 0; i < arguments.length; i++) {
				// remove "entities/" from the entity name
				var currentEntity = requiredEntities[i].substr(9, requiredEntities[i].length);
				blueprints[currentEntity] = arguments[i];
			}
			Nova.initializeProcess();
		});
	}
	
	Global.createBlueprint = function(blueprintName, blueprint) {
		blueprints[blueprintName] = blueprint;
	}
	
	Global.newComponent = function(componentName, component, cantOverwrite) {
		
	}
	
	/*Global.createComponent = function(componentName, componentType, owner, properties) {
		if(components.hasOwnProperty(componentType)) {
			var newComponent = new components[componentType];
			newComponent.NAME = componentName;
			
			newComponent.owner = Global.getEntityByUID(owner);
			
			if(!newComponent.hasOwnProperty('create')) { newComponent.Create = function() { return true; } }
			if(!newComponent.hasOwnProperty('update')) { newComponent.Update = function() {} }
			
			var created = newComponent.Create(properties);
			if(!created) {
				console.error("Failed to create component '" + componentName + "' on entity '" + owner + "'");
				return false;
			}
			return newComponent;
		}
		console.error("Component '" + componentType + "' does not exist (attempted to add to entity" + owner + ")");
		return false;
	}*/
	
	Global.createEntity = function(entityType, properties) {
		if(typeof properties === "undefined") properties = {};
		
		if(!blueprints.hasOwnProperty(entityType)) {
			console.error("Unable to create entity of type '" + entityType + "' (type does not exist)");
			return false;
		}
		var newEntity = new blueprints[entityType](properties);
		entities[newEntity.ID] = newEntity;
		
		return newEntity.ID;
	}
	
	/*Global.createEntity = function(entityType, properties) {
		if(blueprints.hasOwnProperty(entityType)) {
			
			var newEntity = new blueprints[entityType];
			
			newEntity.UID = System.generateUID();
			newEntity.TYPE = entityType;
			
			entities[newEntity.UID] = newEntity;
			if(!Array.isArray(entityTypes[entityType])) entityTypes[entityType] = [];
			entityTypes[entityType].push(newEntity.UID);
			
			if(!newEntity.hasOwnProperty('update')) newEntity.update = function() { };
			
			newEntity.components = {};
			newEntity.preUpdate = [];
			newEntity.postUpdate = [];
			
			newEntity.addComponent = function(componentName, componentType, updateType, properties) {
				var newComponent = Nova.Entities.createComponent(componentName, componentType, newEntity.UID, properties);
				if(!newComponent) return false;
				
				newComponent.NAME = componentName;
				newComponent.owner = this.UID;
				
				updateType = updateType.toUpperCase();
				if(updateType == 'PRE') {
					this.preUpdate.push(componentName);
				} else if(updateType == 'POST') {
					this.preUpdate.push(componentName);
				}
				
				this.components[componentName] = newComponent;
				return true;
			}
			
			newEntity.removeComponent = function(componentName) {
				if(this.components.hasOwnProperty(componentName)) {
					delete this.components[componentName];
					return true;
				}
				return false;
			}
			
			newEntity.getComponent = function(componentName) {
				if(this.components.hasOwnProperty(componentName)) return this.components[componentName];
				return false;
			}
			
			if(newEntity.hasOwnProperty('requiredComponents')) {
				var reqComponents = newEntity.requiredComponents;
				for(var i = 0; i < reqComponents.length; i++) {
					var currentComponent = reqComponents[i][0];
					var componentUpdateType = reqComponents[i][1];
					
					var componentProperties = {};
					if(properties.hasOwnProperty(currentComponent)) { componentProperties = properties[currentComponent]; }
					
					this.addComponent(currentComponent, currentComponent, componentUpdateType, componentProperties);
				}
			}
			newEntity.isDead = false;
			
			if(typeof newEntity.create === "function") newEntity.create(properties);
			delete newEntity.create;
			return newEntity.UID;
			
		} else {
			console.error("Unable to create entity of type '" + entityType + "' (entity type does not exist)");
			return false;
		}
	}*/
	
	Global.destroyEntity = function(entityUID) {
		var entity = Global.getEntityByUID(entityUID);
		if(!entity) return false;

		if(typeof entity.destroy === "function") entity.destroy();
		
		delete entities[entityUID];
		
		// TO DO: make sure to remove any renderers from pixi stage
		// this might have to be done in a delete function on the renderer objects/components
	}
	
	Global.entityCount = function(entityType) {
		if(typeof entityType === "string") {
			if(entityTypes.hasOwnProperty(entityType)) {
				return entityTypes[entityType].length;
			} else {
				return NaN;
			}
		}
		return Object.keys(entities).length;
	}
	
	Global.getEntities = function() {
		// TO DO: probably debug function? might keep it
		console.log(entities);
		return entities;
	}
	Global.getBlueprints = function() {
		return blueprints;
	}
	
	Global.getEntityByID = function(ID) {
		if(entities.hasOwnProperty(ID)) return entities[ID];
		return false;
	}
	
	Global.getEntitiesOfType = function(entityType, callback) {
		if(!entityTypes.hasOwnProperty(entityType)) {
			console.error("Unable to get entity of type '" + entityType + "'");
			return false;
		}
		
		if(typeof callback == "function") {
			for(var i = 0; entityTypes[entityType].length; i++) {
				var currentEntity = Global.getEntityByUID(entityTypes[entityType][i]);
				if(currentEntity) {
					callback(currentEntity);
				}
			}
		} else {
			var entitiesOfType = [];
			for(var i = 0; i < entityTypes[entityType].length; i++) {
				var currentEntity = Global.getEntityByUID(entityTypes[entityType][i]);
				if(currentEntity) {
					entitiesOfType.push(currentEntity);
				}
			}
		}
	}
	
	Global.objects = function() {
		return objects;
	}
	
	Global.newObject = function(objectType, properties) {
		if(!objects.hasOwnProperty(objectType)) {
			console.error("Object type '" + objectType + "' does not exist");
			return false;
		}
		var newObject = new objects[objectType];
		if(newObject.hasOwnProperty('create')) newObject.create(properties);
		
		return newObject;
	}
	
	return Global;
});
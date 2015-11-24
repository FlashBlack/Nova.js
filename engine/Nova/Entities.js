define(['Nova/System'], function(System) {
	var Global = {};
	
	var entities = {},
		blueprints = {},
		entityTypes = {},
		components = {},
		requiredEntities = [];
	
	Global.updateEntities = function() {
		for(var e in entities) {
			var currentEntity = entities[e];
			
			if(currentEntity.canUpdate) currentEntity.update();
		}
	};
	
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
	};
	
	Global.getComponentBlueprints = function() {
		requiredComponents = Nova.getProject().Components;
		
		for(var i = 0; i < requiredComponents.length; i++) {
			requiredComponents[i] = "components/" + requiredComponents[i];
		}
		
		require(requiredComponents, function() {
			for(var i = 0; i < arguments.length; i++) {
				// remove "components/" from the component name
				var currentComponent = requiredComponents[i].substr(11, requiredComponents[i].length);
				components[currentComponent] = arguments[i];
			}
			Nova.initializeProcess();
		})
	}
	
	Global.createBlueprint = function(blueprintName, blueprint) {
		blueprints[blueprintName] = blueprint;
	};
	
	Global.newComponent = function(componentName, component, cantOverwrite) {
		if(components.hasOwnProperty(componentName)) {
			if(components[componentName].hasOwnProperty('_cantOverwrite')) {
				console.error("Can't overwrite component '" + componentName + "'");
				return false;
			}
		}
		if(cantOverwrite) component._cantOverwrite = true;
		components[componentName] = component;
	};
	
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
		// instantiate properties if undefined
		if(typeof properties === "undefined") properties = {};
		
		// ensure the blueprint exists
		if(!blueprints.hasOwnProperty(entityType)) {
			console.error("Unable to create entity of type '" + entityType + "' (type does not exist)");
			return false;
		}
		// create the new entity
		var newEntity = new blueprints[entityType](properties);
		// add the entity reference 
		entities[newEntity.ID] = newEntity;
		
		if(Array.isArray(newEntity.requiredComponents)) {
			var comps = newEntity.requiredComponents;
			for(var i = 0; i < comps.length; i++) {
				if(!properties.hasOwnProperty(comps[i])) properties[comps[i]] = {};
				newEntity.addComponent(comps[i], properties[comps[i]]);
			}
		}
		
		return newEntity.ID;
	}
	
	Global.getComponent = function(component) {
		if(!components[component]) return false;
		return components[component];
	}
	
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
	
	return Global;
});
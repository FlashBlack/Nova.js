"use strict";

Nova.Entities = new function() {
	var Entities = {};
	var EntityBlueprints = {};
	var EntityTypes = {};
	var Components = {};
	var zOrder = [];

	this.CreateBlueprint = function(blueprintName, blueprint) {
		EntityBlueprints[blueprintName] = blueprint;
	}

	this.GetZOrder = function() {
		return zOrder;
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

	this.CreateEntity = function(entityName, properties) {
		// ensure the blueprint exists
		if(EntityBlueprints.hasOwnProperty(entityName)) {
			// assign created instance to a temporary variable
			var newEntity = new EntityBlueprints[entityName];
			// assign its GUID and ENTITY_TYPE
			newEntity.GUID = Nova.System.GenerateGUID();
			newEntity.ENTITY_TYPE = entityName;
			
			// add created entity to Entities object
			Entities[newEntity.GUID] = newEntity;
			if(!Array.isArray(EntityTypes[entityName])) EntityTypes[entityName] = [];
			EntityTypes[entityName].push(newEntity.GUID);

			// add created entities GUID to zOrder array
			zOrder.push(newEntity.GUID);
			// call the entities create function if it has one, passing the properties
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
			if(typeof newEntity.Create === 'function') newEntity.Create(properties);
			newEntity.isDead = false;
			return newEntity.GUID;
		}
		return false;
	}

	this.DestroyEntity = function(entityGUID) {
		var entity = this.GetEntityByID(entityGUID);
		if(entity) {
			entity.isDead = true;
			if(typeof entity.Destroy === 'function') entity.Destroy();
			delete Entities[entityGUID];
			var i = zOrder.indexOf(entityGUID);
			if(i > -1) zOrder.splice(i, 1);
		}
	}

	this.EntityCount = function() {
		return Object.keys(Entities).length;
	}

	this.GetEntities = function() {
		return Entities;
	}

	this.GetEntityByID = function(ID) {
		if(Entities.hasOwnProperty(ID)) return Entities[ID];
		return false;
	}

	this.GetEntityType = function(type, callback) {
		if(!Array.isArray(EntityTypes[type])) return false;

		if(typeof callback === 'undefined') {
			var entitiesOfType = [];
			for(var i = 0; i < EntityTypes[type].length; i++) {
				var currentEntity = EntityTypes[type][i];
				if(typeof Entities[currentEntity] !== 'undefined') {
					entitiesOfType.push(Entities[currentEntity]);
				}
			}
			return entitiesOfType;
		} else if(typeof callback === 'function') {
			for(var i = 0; i < EntityTypes[type]; i++) {
				var currentEntity = EntityTypes[type][i];
				console.log(currentEntity);
				callback(currentEntity);
			}
		} else {
			return false;
		}
	}
}
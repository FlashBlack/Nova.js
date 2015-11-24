define([
	'Nova/Class',
	'Nova/System',
	'Nova/Entities',
	'Nova/Module/Collider',
], function(Class, System, Entities, Collider){
	
	var Entity = Class.extend({
		isDead: false,
		canUpdate: true,
		ID: System.generateUID(),
		position: new System.vector2(),
		init: function(properties, flags) {
			if(properties.hasOwnProperty('Position') && properties.Position.isVector2) this.position = properties.Position;
			
			function hasFlag(flagName) { return (flags.indexOf(flagName) > -1); }
			
			if(hasFlag('hasCollider')) this.collider = new Collider();
		},
		
		update: function(){
		},
		
		kill: function(){
			//Entities.removeEntity(this.id);
			this.isDead = true;
		},
		
		setPosition: function(position) {
			if(!position.isVector2) return false;
			this.position.set(position.x, position.y);
		},
		setX: function(x) {
			this.position.x = parseFloat(x);
		},
		setY: function(y) {
			this.position.y = parseFloat(y);
		},
		
		components: {},
		addComponent: function(component, properties){
			if(typeof properties === "undefined") properties = {};
			var componentToAdd = Entities.getComponent(component);
			if(!componentToAdd) {
				console.error("Unable to add component '" + component + "' to entity '" + this.ID + "' (component type does not exist)");
				return false
			}
			var newComponent = new componentToAdd();
			newComponent.init(properties);
			this.components[component] = newComponent;
		},
		removeComponent: function(){}
	});
	
	return Entity;
});
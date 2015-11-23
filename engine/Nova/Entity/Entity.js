define([
	'Nova/Class',
	'Nova/System',
	'Nova/Entities',
	'Nova/Module/Collider',
], function(Class, System, Entities, Collider){
	
	var Entity = Class.extend({
		init: function(properties, flags) {
			this.ID = System.generateUID();
			this.position = properties.Position || new System.vector2();
			this.isDead = false;
			
			function hasFlag(flagName) { return (flags.indexOf(flagName) > -1); }
			
			if(hasFlag('hasCollider')) this.collider = new Collider();
		},
		update: function(){
		
			if (this.collider) this.collider.update();
		
		},
		kill: function(){
			Entities.removeEntity(this.id);
			this.isDead = true;
		},
		addComponent: function(){

		},
		removeComponent: function(){
			
		}
	});
	
	return Entity;
});
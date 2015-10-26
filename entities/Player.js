"use strict";

Nova.CreateBlueprint('Player', function() {
	this.requiredComponents = ['Transform', 'SpriteRenderer'];
	
	var Target = {
		x: 0,
		y: 0
	}
	var moving = false;
	this.moveType = 'lerp';
	this.speed = 1;
	
	this.Create = function(properties) {
		this.moveType = properties.moveType;
	}
	this.Update = function() {
	}

	this.SetTarget = function(x, y) {
		Target.x = x;
		Target.y = y;
		moving = true;
	}

	this.SetSpeed = function(newSpeed) {
		this.speed = newSpeed;
		console.log('set speed to ' + newSpeed);
	}
})
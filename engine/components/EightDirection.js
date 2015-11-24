"use strict";

define(['Nova/Input'], function(Input){
    
    function EightDirection(){
    	var keys = {
    		'up': ['W', 'UP'],
    		'down': ['S', 'DOWN'],
    		'left': ['A', 'LEFT'],
    		'right': ['D', 'RIGHT'],
    	}
    	this.moveSpeed = 200;
    	this.rotateSpeed = 15;
    	this.rotateTowards = true;
    	
    	this.init = function(properties) {
    		if(properties.hasOwnProperty('keys')) {
    			for(var key in keys) {
    				for(var i in properties.keys[key]) {
    					keys[key].push(properties.keys[key][i]);
    				}
    			}
    		}
    		if(properties.hasOwnProperty('moveSpeed')) this.moveSpeed = properties.moveSpeed;
    		if(properties.hasOwnProperty('rotateSpeed')) this.moveSpeed = properties.rotateSpeed;
    		if(properties.hasOwnProperty('rotateTowards')) this.rotateTowards = properties.rotateTowards;
    
    		return true;
    	}
    	
    	this.update = function() {
    		var Transform = this.Owner.GetComponent('Transform');
    		var horizontal = 0;
    		var vertical = 0;
    		// check input keys
    		for(var i in keys.up) {
    			if(Input.keyDown(keys.up[i])) {
    				vertical--;
    				break;
    			}
    		}
    		for(var i in keys.down) {
    			if(Input.keyDown(keys.down[i])) {
    				vertical++;
    				break;
    			}
    		}
    		for(var i in keys.left) {
    			if(Input.keyDown(keys.left[i])) {
    				horizontal--;
    				break;
    			}
    		}
    		for(var i in keys.right) {
    			if(Input.keyDown(keys.right[i])) {
    				horizontal++;
    				break;
    			}
    		}
    		if(horizontal != 0 || vertical != 0) {
    			var moveAngle = Nova.System.angleTowards(0, 0, horizontal, vertical);
    			if(this.rotateTowards) {
    				this.Owner.setAngle(moveAngle);
    			}
    			//var solids = Nova.getSolids();
    			var offset = new Nova.System.Vector2((this.moveSpeed * Nova.dt) * Math.cos(Nova.System.toRadians(moveAngle)), 
    												(this.moveSpeed * Nova.dt) * Math.sin(Nova.System.toRadians(moveAngle)));
    
    			this.Owner.setPosition(offset);
    		}
    	}	
    }
    
    return EightDirection;
});
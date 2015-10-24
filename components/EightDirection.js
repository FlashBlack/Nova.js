Nova.NewComponent('EightDirection', function() {
	var keys = {
		'up': ['W', 'UP'],
		'down': ['S', 'DOWN'],
		'left': ['A', 'LEFT'],
		'right': ['D', 'RIGHT'],
	}
	this.moveSpeed = 200;
	this.rotateSpeed = 15;
	this.rotateTowards = true;
	this.Create = function(properties) {
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
	}
	this.Update = function() {
		var Transform = this.Owner.GetComponent('Transform');
		var horizontal = 0;
		var vertical = 0;
		// check input keys
		for(var i in keys.up) {
			if(Nova.Input.KeyDown(keys.up[i])) {
				vertical--;
				break;
			}
		}
		for(var i in keys.down) {
			if(Nova.Input.KeyDown(keys.down[i])) {
				vertical++;
				break;
			}
		}
		for(var i in keys.left) {
			if(Nova.Input.KeyDown(keys.left[i])) {
				horizontal--;
				break;
			}
		}
		for(var i in keys.right) {
			if(Nova.Input.KeyDown(keys.right[i])) {
				horizontal++;
				break;
			}
		}
		if(horizontal != 0 || vertical != 0) {
			var moveAngle = Nova.System.angleTowards(0, 0, horizontal, vertical);
			if(this.rotateTowards) {
				Transform.SetAngle(moveAngle);
			}
			var solids = Nova.getSolids();
			var offset = {
				x: (this.moveSpeed * Nova.dt) * Math.cos(Nova.System.toRadians(moveAngle)),
				y: (this.moveSpeed * Nova.dt) * Math.sin(Nova.System.toRadians(moveAngle))
			}
			var hitHorizontal = false;
			var hitVertical = false;
			var Collider = this.Owner.GetComponent('Collider');
			for(var i in solids) {
				var otherCollider = Nova.GetEntityByID(solids[i][0]).GetComponent(solids[i][1]);
				if(horizontal != 0) {
					var horizontalCollision = Nova.Collides(Collider, otherCollider, {x: offset.x, y: 0});
					if(horizontalCollision) {
						hitHorizontal = true;
						var overlaps = false;
						// Transform.Position.y += 
					}
				}
				if(vertical != 0) {
					var verticalCollision = Nova.Collides(Collider, otherCollider, {x: 0, y: offset.y});
					if(verticalCollision) {
						hitVertical = true;
						var overlaps = false;
						// Transform.Position.y += Math.sign(vertical);
					}
				}
			}
			if(!hitVertical) Transform.Position.y += offset.y;
			if(!hitHorizontal) Transform.Position.x += offset.x;
		}
	}
}, true)
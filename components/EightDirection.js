Nova.NewComponent('EightDirection', function() {
	var keys = {
		'up': ['W', 'UP'],
		'down': ['S', 'DOWN'],
		'left': ['A', 'LEFT'],
		'right': ['D', 'RIGHT'],
	}
	var moveRelative = true;
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
		moveRelative = properties.moveRelative || true;

		return true;
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
			var offset = new Nova.System.Vector2((this.moveSpeed * Nova.dt) * Math.cos(Nova.System.toRadians(moveAngle)), 
												(this.moveSpeed * Nova.dt) * Math.sin(Nova.System.toRadians(moveAngle)));
			if(moveRelative) offset.RotateAround(new Nova.System.Vector2(), -Nova.Viewport.GetAngle());

			Transform.Position.Y += offset.Y;
			Transform.Position.X += offset.X;
		}
	}
}, true)
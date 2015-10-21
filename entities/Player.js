GCE.CreateBlueprint('Player', function() {
	this.requiredComponents = ['Transform', 'SpriteRenderer'];
	
	var Target = {
		x: 0,
		y: 0
	}
	var moving = false;
	this.speed = 1;
	
	this.Create = function(properties) {
		console.log('Created Player entity');
	}
	this.Update = function() {
		if(moving) {
			var Position = this.GetComponent('Transform').Position;
			if(GCE.System.distance(Position.x, Position.y, Target.x, Target.y) >= 4) {
				var angle = GCE.System.angleTowards(Position.x, Position.y, Target.x, Target.y)

				Position.x += Math.cos(angle * Math.PI / 180) * this.speed;
				Position.y += Math.sin(angle * Math.PI / 180) * this.speed;
			} else {
				moving = false;
			}
		}
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
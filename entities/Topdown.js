GCE.CreateBlueprint('Topdown', function() {
	this.requiredComponent = ['Transform', 'SpriteRenderer'];

	var Target = {
		x: 0,
		y: 0
	}
	var moving = false;
	this.speed = 1;

	this.Create = function(parameters) {
		console.log('Created topdown entity');
	}

	this.Update = function() {
		if(moving) {
			var Transform = this.GetComponent('Transform')
			var Position = Transform.Position;
			if(GCE.System.distance(Position.x, Position.y, Target.x, Target.y) >= 4) {
				var angle = GCE.System.angleTowards(Position.x, Position.y, Target.x, Target.y);
				// Transform.SetAngle(Math.round(angle));

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
	}
})
GCE.CreateBlueprint('Topdown', function() {
	this.requiredComponents = [['Transform', 'Post'], ['SpriteRenderer', 'Post'], ['EightDirection', 'Pre'], ['Collider', 'Post']];

	var Target = {
		x: 0,
		y: 0
	}
	var moving = false;
	this.speed = 100;

	this.Create = function(parameters) {
		console.log('Created topdown entity');
	}

	this.Update = function() {
		var Transform = this.GetComponent('Transform');
		var Position = Transform.Position;
		var mouseAngle = GCE.System.angleTowards(Position.x, Position.y, GCE.Input.mousex, GCE.Input.mousey);
		Transform.SetAngle(GCE.System.angleLerp(Transform.GetAngle(), mouseAngle, 15 * GCE.dt));
		/*if(moving) {
			if(GCE.System.distance(Position.x, Position.y, Target.x, Target.y) >= 4) {
				var angle = GCE.System.angleTowards(Position.x, Position.y, Target.x, Target.y);

				Position.x += Math.cos(angle * Math.PI / 180) * (this.speed * GCE.dt);
				Position.y += Math.sin(angle * Math.PI / 180) * (this.speed * GCE.dt);
			} else {
				moving = false;
			}
		}*/
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
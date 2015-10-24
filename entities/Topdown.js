Nova.CreateBlueprint('Topdown', function() {
	this.requiredComponents = [['Transform', 'Post'], ['SpriteRenderer', 'Post'], ['EightDirection', 'Pre'], ['Collider', 'Pre']];

	var Target = {
		x: 0,
		y: 0
	}
	var moving = false;
	this.speed = 100;

	this.Create = function(parameters) {
	}

	this.Update = function() {
		var Transform = this.GetComponent('Transform');
		var Position = Transform.Position;
		var mouseAngle = Nova.System.angleTowards(Position.x, Position.y, Nova.Input.mousex, Nova.Input.mousey);
		Transform.SetAngle(Nova.System.angleLerp(Transform.GetAngle(), mouseAngle, 15 * Nova.dt));
		/*if(moving) {
			if(Nova.System.distance(Position.x, Position.y, Target.x, Target.y) >= 4) {
				var angle = Nova.System.angleTowards(Position.x, Position.y, Target.x, Target.y);

				Position.x += Math.cos(angle * Math.PI / 180) * (this.speed * Nova.dt);
				Position.y += Math.sin(angle * Math.PI / 180) * (this.speed * Nova.dt);
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
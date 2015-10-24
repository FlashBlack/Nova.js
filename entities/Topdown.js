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
		var mouseAngle = Nova.System.angleTowards(Position.x, Position.y, Nova.Input.Mouse.x, Nova.Input.Mouse.y);
		Transform.SetAngle(Nova.System.angleLerp(Transform.GetAngle(), mouseAngle, 15 * Nova.dt));
		// if(Nova.Input.Mouse.Pressed) Nova.Audio.Play('laser9');

		//Move Viewport
		if (Nova.Input.KeyDown('I')) Nova.Viewport.Position.Y -= 100 * Nova.dt;
		if (Nova.Input.KeyDown('J')) Nova.Viewport.Position.X -= 100 * Nova.dt;
		if (Nova.Input.KeyDown('K')) Nova.Viewport.Position.Y += 100 * Nova.dt;
		if (Nova.Input.KeyDown('L')) Nova.Viewport.Position.X += 100 * Nova.dt;

		//Rotate Viewport
		if (Nova.Input.KeyDown('U')) Nova.Viewport.Rotation += 100 * Nova.dt;
		if (Nova.Input.KeyDown('O')) Nova.Viewport.Rotation -= 100 * Nova.dt;

		//Zoom Viewport
		if (Nova.Input.KeyDown('OPENBRACKET')) {
			Nova.Viewport.Scale.X -= 1 * Nova.dt
			Nova.Viewport.Scale.Y -= 1 * Nova.dt
		}
		if (Nova.Input.KeyDown('CLOSEBRACKET')){
			Nova.Viewport.Scale.X += 1 * Nova.dt
			Nova.Viewport.Scale.Y += 1 * Nova.dt
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
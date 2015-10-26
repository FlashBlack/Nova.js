Nova.CreateBlueprint('Topdown', function() {
	this.requiredComponents = [['Transform', 'Post'], ['SpriteRenderer', 'Post'], ['Collider', 'Pre']];

	var Target = {
		x: 0,
		y: 0
	}
	var moving = false;
	this.speed = 150;

	this.Create = function(parameters) {
	}

	this.Update = function() {
		var Transform = this.GetComponent('Transform');
		var Position = Transform.Position;

		//Move Viewport
		/*if (Nova.Input.KeyDown('I')) Nova.Viewport.Position.Y -= 100 * Nova.dt;
		if (Nova.Input.KeyDown('J')) Nova.Viewport.Position.X -= 100 * Nova.dt;
		if (Nova.Input.KeyDown('K')) Nova.Viewport.Position.Y += 100 * Nova.dt;
		if (Nova.Input.KeyDown('L')) Nova.Viewport.Position.X += 100 * Nova.dt;*/

		//Move Viewport To Topdown
		Nova.Viewport.Position.Set(Nova.System.lerp(Nova.Viewport.Position.X ,Transform.Position.x - Nova.Viewport.Size.X/2, 2 * Nova.dt), Nova.System.lerp(Nova.Viewport.Position.Y, Transform.Position.y - Nova.Viewport.Size.Y/2, 2 * Nova.dt))

		//Rotate Viewport
		if (Nova.Input.KeyDown('U')) Nova.Viewport.Rotation += 50 * Nova.dt;
		if (Nova.Input.KeyDown('O')) Nova.Viewport.Rotation -= 50 * Nova.dt;

		if(Nova.Input.KeyDown("D")) Transform.Position.x += this.speed * Nova.dt;
		if(Nova.Input.KeyDown("A")) Transform.Position.x -= this.speed * Nova.dt;
		if(Nova.Input.KeyDown("W")) Transform.Position.y -= this.speed * Nova.dt;
		if(Nova.Input.KeyDown("S")) Transform.Position.y += this.speed * Nova.dt;

		if(Nova.Input.KeyPressed("T")) {
			Nova.Viewport.Scale.X = .5;
			Nova.Viewport.Scale.Y = .5;
		}

		var mouseAngle = Nova.System.angleTowards(Position.x, Position.y, Nova.Input.Mouse.X, Nova.Input.Mouse.Y);
		Nova.Render.Arc({
			Position: Nova.Input.Mouse,
			Radius: 6,
			Fill: true
		})
		Transform.SetAngle(Nova.System.angleLerp(Transform.GetAngle(), mouseAngle, 15 * Nova.dt));

		var solids = Nova.getSolids();
		for(var i = 0; i < solids.length; i++) {
			if(Nova.Collision.Overlaps(this.GetComponent("Collider"), solids[i])) {
				console.log('overlaps');
			}
		}
		if(Nova.Input.Mouse.Pressed) {
			Nova.Audio.Play('laser9');
		}

		//Zoom Viewport
		if (Nova.Input.KeyDown('OPENBRACKET')) {
			Nova.Viewport.Scale.X -= 1 * Nova.dt
			Nova.Viewport.Scale.Y -= 1 * Nova.dt
		}
		if (Nova.Input.KeyDown('CLOSEBRACKET')){
			Nova.Viewport.Scale.X += 1 * Nova.dt
			Nova.Viewport.Scale.Y += 1 * Nova.dt
		}
		Nova.Render.Sprite({
			Position: new Nova.System.Vector2(-32, 0),
			Sprite: 'Test',
		})
		Nova.Render.Image({
			Position: new Nova.System.Vector2(-32, 32),
			Image: 'test'
		})
		Nova.Render.Rectangle({
			Position: new Nova.System.Vector2(-32, 64),
			Size: new Nova.System.Vector2(32, 32),
			Fill: true,
		})
		Nova.Render.Line({
			Start: new Nova.System.Vector2(-32, 96),
			End: new Nova.System.Vector2(0, 128)
		})
		Nova.Render.Path({
			Path: [
			new Nova.System.Vector2(-32, 160),
			new Nova.System.Vector2(-16, 128),
			new Nova.System.Vector2(0, 160)
			],
			Complete: true,
			Fill: true
		})
		Nova.Render.Arc({
			Position: new Nova.System.Vector2(-16, 176),
			Radius: 16,
			Fill: true
		})
		/*Nova.Render.Ellipse({
			Position: new Nova.System.Vector2(-16, 208),
			Radius: new Nova.System.Vector2(16, 8),
			Fill: true,
		})*/
		Nova.Render.Text({
			Position: new Nova.System.Vector2(-32, 224),
			Text: 'butts'
		})
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
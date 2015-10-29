"use strict";

Nova.CreateBlueprint('Player', function() {
	this.requiredComponents = [['Transform', 'Post'], ['SpriteRenderer', 'Post'], ['EightDirection', 'Pre'], ['Collider', 'Post'], ['ParticleEmitter', 'Post']];

	this.Create = function(parameters) {
		var Position = this.GetComponent('Transform').Position;
		Nova.Viewport.SetPosition(Position.X, Position.Y);

		var ParticleEmitter = this.GetComponent('ParticleEmitter');
		ParticleEmitter.AddParticles(100, {
			Position: Position,
		});
	}

	this.Update = function() {
		var Transform = this.GetComponent('Transform');
		var Position = Transform.Position;

		//Move Viewport To Topdown
		var viewportPosition = Nova.Viewport.GetPosition();
		Nova.Viewport.SetPosition(Nova.System.lerp(viewportPosition.X , Position.X, 2 * Nova.dt), Nova.System.lerp(viewportPosition.Y, Position.Y, 2 * Nova.dt))

		//Rotate Viewport
		var viewportAngle = Nova.Viewport.GetAngle();
		if (Nova.Input.KeyDown('U')) Nova.Viewport.SetAngle(viewportAngle + 50 * Nova.dt);
		if (Nova.Input.KeyDown('O')) Nova.Viewport.SetAngle(viewportAngle - 50 * Nova.dt);

		if(Nova.Input.KeyPressed("T")) Nova.Viewport.SetScale(.5, .5);

		var mouseAngle = Nova.System.AngleTowards(Position.X, Position.Y, Nova.Input.Mouse.X, Nova.Input.Mouse.Y);
		Transform.SetAngle(Nova.System.angleLerp(Transform.GetAngle(), mouseAngle, 15 * Nova.dt));

		Nova.Render.Arc({
			Position: Nova.Input.Mouse,
			Radius: 6,
			Fill: true
		})

		if(Nova.Input.Mouse.Pressed) {
			var bullet = Nova.GetEntityByID(Nova.CreateEntity('Bullet', {
				Transform: {
					Position: Position,
					Origin: new Nova.System.Vector2(0, 2.5),
				},
				SpriteRenderer: {
					sprite: 'Bullet'
				},
				Collider: {
					SubColliders: [[[0, 0], [10, 0], [10, 5], [0, 5]]],
					draw: true
				},
				Bullet: {
					Speed: 500,
					AngleOfMotion: Transform.GetAngle()
				}
			}));
			bullet.GetComponent("Transform").SetAngle(Transform.GetAngle());
		}

		Nova.Render.Text({
			Position: new Nova.System.Vector2(),
			Text: 'Test',
			Colour: 'Blue',
		})

		//Zoom Viewport
		if (Nova.Input.KeyDown('OPENBRACKET')) {
			var currentScale = Nova.Viewport.GetScale();
			Nova.Viewport.SetScale(currentScale.X - Nova.dt, currentScale.Y - Nova.dt);
		}
		if (Nova.Input.KeyDown('CLOSEBRACKET')){
			var currentScale = Nova.Viewport.GetScale();
			Nova.Viewport.SetScale(currentScale.X + Nova.dt, currentScale.Y + Nova.dt);
		}
	}
})
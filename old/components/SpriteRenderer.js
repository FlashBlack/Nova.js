"use strict";

Nova.Entities.NewComponent('SpriteRenderer', function() {
	this.drawAtInteger = false;
	this.Alpha = 1;

	this.Create = function(properties) {
		if(!properties.hasOwnProperty('sprite')) return false;
		this.sprite = Nova.Loader.GetSprite(properties.sprite);
		this.img = Nova.Loader.GetImage(this.sprite);
		if(properties.hasOwnProperty('drawAtInteger')) { this.drawAtInteger = properties.drawAtInteger; }
		if(properties.hasOwnProperty('animation')) { this.currentAnimation = properties.animation }
		else { this.currentAnimation = Object.keys(this.sprite.animations)[0]; }

		if(properties.hasOwnProperty('alpha')) this.Alpha = parseInt(properties.alpha);

		return true;
	}

	this.Update = function() {
		// get the entities Transform component
		var Transform = this.Owner.GetComponent('Transform');
		// figure out where to draw it based on Transform.Position and Transform.Anchor
		var Origin = Transform.GetWorldOrigin();
		if(this.drawAtInteger) {
			Origin.X = Math.floor(Origin.X);
			Origin.Y = Math.floor(Origin.Y);
		}
		var frame = this.GetFrame();
		// draw the image
		Nova.Render.Sprite({
			Position: Origin,
			Angle: Transform.GetAngle(),
			Sprite: this.sprite,
			Frame: this.GetFrame()
		})		
	}

	this.GetFrame = function(id) {
		if(id) return 0;
		return this.sprite.animations[this.currentAnimation][0];
	}
}, true);
Nova.NewComponent('SpriteRenderer', function() {
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
		var drawX = Origin.X;
		var drawY = Origin.Y;
		if(this.drawAtInteger) {
			drawX = Math.round(drawX);
			drawY = Math.round(drawY);
		}
		var frame = this.GetFrame();
		// draw the image
		// Nova.Render.Sprite({
		// 	Sprite: 
		// })
		Nova.ctx.save();
		Nova.Viewport.Apply();
		Nova.ctx.translate(Origin.X, Origin.Y);
		Nova.ctx.rotate(Nova.System.toRadians(Transform.GetAngle()));
		Nova.ctx.translate(-Origin.X, -Origin.Y);
		Nova.ctx.globalAlpha = .5;
		Nova.ctx.drawImage(this.img, frame.x, frame.y, frame.width, frame.height, Origin.X, Origin.Y, frame.width * Transform.GetScale(), frame.height * Transform.GetScale());
		Nova.ctx.globalAlpha = 1;
		Nova.ctx.restore();
		
	}

	this.GetFrame = function(id) {
		if(id) return 0;
		return this.sprite.animations[this.currentAnimation][0];
	}
}, true);
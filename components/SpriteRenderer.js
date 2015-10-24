Nova.NewComponent('SpriteRenderer', function() {
	this.drawAtInteger = false;
	this.Create = function(properties) {
		if(!properties.hasOwnProperty('sprite')) return false;
		this.sprite = Nova.Loader.GetSprite(properties.sprite);
		this.img = Nova.Loader.GetImage(this.sprite);
		if(properties.hasOwnProperty('drawAtInteger')) { this.drawAtInteger = properties.drawAtInteger; }
		if(properties.hasOwnProperty('animation')) { this.currentAnimation = properties.animation }
		else { this.currentAnimation = Object.keys(this.sprite.animations)[0]; }

		return true;
	}

	this.Update = function() {
		// get the entities Transform component
		var Transform = this.Owner.GetComponent('Transform');
		// figure out where to draw it based on Transform.Position and Transform.Anchor
		var drawX = Transform.Position.x - Transform.Anchor.x;
		var drawY = Transform.Position.y - Transform.Anchor.y;
		if(this.drawAtInteger) {
			drawX = Math.round(drawX);
			drawY = Math.round(drawY);
		}
		var frame = this.GetFrame();
		// draw the image
		Nova.ctx.save();
		Nova.ctx.translate(drawX, drawY);
		Nova.ctx.rotate(Nova.System.toRadians(Transform.GetAngle()));
		Nova.ctx.translate(-drawX, -drawY);
		Nova.ctx.drawImage(this.img, frame.x, frame.y, frame.width, frame.height, drawX, drawY, frame.width * Transform.GetScale(), frame.height * Transform.GetScale());
		Nova.ctx.restore();
		
	}

	this.GetFrame = function() {
		return this.sprite.animations[this.currentAnimation][0];
	}
}, true);
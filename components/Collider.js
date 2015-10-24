Nova.NewComponent('Collider', function() {
	this.draw = false;
	this.bboxleft = 0;
	this.bboxright = 0;
	this.bboxtop = 0;
	this.bboxbottom = 0;

	this.Create = function(parameters) {
		if(parameters.hasOwnProperty('draw')) this.draw = parameters.draw;

		if(parameters.hasOwnProperty('isSolid')) Nova.addSolid([this.Owner.GUID, this.componentName]);

		this.Update();
	}

	this.Update = function() {
		this.UpdateBoundingBox("SpriteRenderer");
		if(!this.draw) return;
		this.Draw();
	}

	this.Draw = function() {
		Nova.ctx.fillStyle = 'lime';
		Nova.ctx.strokeStyle = 'lime';
		Nova.lineWidth = 1;
		Nova.ctx.globalAlpha = .25;
		Nova.ctx.fillRect(Math.floor(this.bboxleft), Math.floor(this.bboxtop), Math.ceil(this.bboxright - this.bboxleft), Math.ceil(this.bboxbottom - this.bboxtop));
		Nova.ctx.globalAlpha = 1;
		Nova.ctx.strokeRect(Math.floor(this.bboxleft), Math.floor(this.bboxtop), Math.ceil(this.bboxright - this.bboxleft), Math.ceil(this.bboxbottom - this.bboxtop));
	}

	this.UpdateBoundingBox = function(renderer) {
		renderer = this.Owner.GetComponent(renderer);
		var Transform = this.Owner.GetComponent("Transform");
		if(!renderer || !Transform) return false;

		var Angle = -Transform.GetAngle();
		var startX = Transform.Position.x - Transform.Anchor.x;
		var startY = Transform.Position.y - Transform.Anchor.y;

		var spriteWidth = renderer.GetFrame().width;
		var spriteHeight = renderer.GetFrame().height;

		var tl = {x: startX, y: startY};
		var tr = Nova.System.rotateAround(startX + spriteWidth, startY, startX, startY, Angle);
		var br = Nova.System.rotateAround(startX + spriteWidth, startY + spriteHeight, startX, startY, Angle);
		var bl = Nova.System.rotateAround(startX, startY + spriteHeight, startX, startY, Angle);

		var mid = Nova.System.midpoint(tl.x, tl.y, br.x, br.y);
		var top = mid.y;
		var bottom = mid.y;
		var left = mid.x;
		var right = mid.x;

		var setSide = function(corners) {
			for(var i in corners) {
				var corner = corners[i];
				if(corner.x < left) left = corner.x;
				if(corner.y < top) top = corner.y;
				if(corner.x > right) right = corner.x;
				if(corner.y > bottom) bottom = corner.y;
			}
		}
		
		setSide([tl, tr, br, bl]);
		this.bboxleft = left;
		this.bboxright = right;
		this.bboxtop = top;
		this.bboxbottom = bottom;

		return true;
	}
})
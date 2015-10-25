Nova.NewComponent('Collider', function() {
	this.draw = false;
	this.bboxleft = 0;
	this.bboxright = 0;
	this.bboxtop = 0;
	this.bboxbottom = 0;
	var midpoint = [0, 0];
	var self = this;

	var polygonActual = [];
	var polygon = [];
	var lastAngle = 0;

	this.Create = function(parameters) {
		if(parameters.hasOwnProperty('draw')) this.draw = parameters.draw;
		if(parameters.hasOwnProperty('isSolid')) Nova.addSolid([this.Owner.GUID, this.componentName]);

		if(!parameters.hasOwnProperty('polygon') || !Array.isArray(parameters.polygon)) return false;
		for(var i = 0; i < parameters.polygon.length; i++) {
			if(!Array.isArray(parameters.polygon)) return false;
			polygonActual.push(new Nova.System.Vector2(parameters.polygon[i][0], parameters.polygon[i][1]));
			polygon.push(new Nova.System.Vector2(parameters.polygon[i][0], parameters.polygon[i][1]));
		}

		this.Update();
		return true;
	}

	this.Update = function() {
		this.UpdateBoundingBox("SpriteRenderer");
		if(lastAngle != this.Owner.GetComponent("Transform").GetAngle()) {
			UpdateCollider();
		}
		lastAngle = this.Owner.GetComponent("Transform").GetAngle();
		if(!this.draw) return;
		this.Draw();
	}

	this.Draw = function() {
		var Transform = this.Owner.GetComponent("Transform");
		var startX = Transform.Position.x - Transform.Anchor.x;
		var startY = Transform.Position.y - Transform.Anchor.y;
		var Angle = Transform.GetAngle();

		Nova.ctx.save();
		Nova.Viewport.Apply();
		// draw collider
		Nova.ctx.fillStyle = 'blue';
		Nova.ctx.strokeStyle = 'blue';
		Nova.ctx.lineWidth = 1;
		Nova.ctx.beginPath();
		Nova.ctx.moveTo(startX + polygon[0].X, startY + polygon[0].Y);
		for(var i = 1; i < polygon.length; i++) {
			var currentPoint = polygon[i];
			// var pointPosition = Nova.System.rotateAround(startX + currentPoint.X, startY + currentPoint.Y, startX, startY, -Angle);
			Nova.ctx.lineTo(startX + currentPoint.X, startY + currentPoint.Y);
			if(i == polygon.length-1) {
				Nova.ctx.closePath();
			}
		}
		Nova.ctx.globalAlpha = 1;
		Nova.ctx.stroke();
		Nova.ctx.globalAlpha = .25;
		Nova.ctx.fill();

		// draw bounding box
		Nova.ctx.fillStyle = 'lime';
		Nova.ctx.strokeStyle = 'lime';
		Nova.ctx.globalAlpha = .25;
		Nova.ctx.fillRect(Math.floor(this.bboxleft), Math.floor(this.bboxtop), Math.ceil(this.bboxright - this.bboxleft), Math.ceil(this.bboxbottom - this.bboxtop));
		Nova.ctx.globalAlpha = 1;
		Nova.ctx.strokeRect(Math.floor(this.bboxleft), Math.floor(this.bboxtop), Math.ceil(this.bboxright - this.bboxleft), Math.ceil(this.bboxbottom - this.bboxtop));
		Nova.ctx.restore();
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
		midpoint = mid;
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

	var UpdateCollider = function() {
		var Angle = self.Owner.GetComponent("Transform").GetAngle();
		for(var i = 0; i < polygonActual.length; i++) {
			polygon[i].Set(polygonActual[i].X, polygonActual[i].Y);
			polygon[i].RotateAround(new Nova.System.Vector2(), -Angle);
		}
	}
})
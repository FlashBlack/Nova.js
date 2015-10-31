"use strict";

/*Nova.NewComponent('Collider', function() {
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
	var type = 'Circle';
	var properties = {
		Width: 0,
		Height: 0,
		Radius: 32
	}

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

	this.getPolygon = function() {
		var Transform = this.Owner.GetComponent("Transform");
		var startX = Transform.Position.x - Transform.Anchor.x;
		var startY = Transform.Position.y - Transform.Anchor.y;
		var poly = [];
		for(var i = 0; i < polygon.length; i++) {
			poly.push(new Nova.System.Vector2(polygon[i].X + startX, polygon[i].Y + startY));
		}
		return poly;
	}

	this.GetPosition = function() {
		var Transform = this.Owner.GetComponent("Transform");
		var startX = Transform.Position.x - Transform.Anchor.x;
		var startY = Transform.Position.y - Transform.Anchor.y;
		return new Nova.System.Vector2(startX, startY);
	}

	this.GetProperty = function(propertyName) {
		if(properties.hasOwnProperty(propertyName)) return properties[propertyName];
		return false;
	}
})*/

Nova.NewComponent('Collider', function() {
	var subCollidersLocal = [];
	var subCollidersWorld = [];

	var midpoint;
	var boundingBoxLocal = {};
	var boundingBoxWorld = {};

	this.Create = function(properties) {
		var edges = {};
		if(properties.hasOwnProperty('SubColliders') && Array.isArray(properties.SubColliders)) {
			for(var i = 0; i < properties.SubColliders.length; i++) {
				var currentSubCollider = properties.SubColliders[i];
				var newCollider = [];
				for(var j = 0; j < currentSubCollider.length; j++) {
					var currentPoint = currentSubCollider[j];
					var newPoint = null;
					
					if(Array.isArray(currentPoint) && currentPoint.length >= 2) {
						newPoint = new Nova.System.Vector2(currentPoint[0], currentPoint[1]);
					} else if(currentPoint.isVector2) {
						newPoint = currentPoint.Copy();
					} else {
						console.log("Unable to add point #" + j + " to subcollider. ", "Passed data: " + currentPoint);
					}
					if(newPoint != null) {
						if(Object.keys(edges).length == 0) {
							edges.top = newPoint.Y;
							edges.bottom = newPoint.Y;
							edges.left = newPoint.X;
							edges.right = newPoint.X;
						}
						else {
							if(newPoint.Y < edges.top) edges.top = newPoint.Y;
							if(newPoint.Y > edges.bottom) edges.bottom = newPoint.Y;
							if(newPoint.X < edges.left) edges.left = newPoint.X;
							if(newPoint.X > edges.right) edges.right = newPoint.X;

						}
						newCollider.push(newPoint);
					}
				}
				subCollidersLocal.push(newCollider);
			}
		} else {
			return false;
		}

		midpoint = new Nova.System.Vector2((edges.left + edges.right) / 2, (edges.top + edges.bottom) / 2);

		boundingBoxLocal.top = midpoint.Y;
		boundingBoxLocal.bottom = midpoint.Y;
		boundingBoxLocal.left = midpoint.X;
		boundingBoxLocal.right = midpoint.X;

		for(var i = 0; i < subCollidersLocal.length; i++) {
			var currentSubCollider = subCollidersLocal[i];
			for(var j = 0; j < currentSubCollider.length; j++) {
				var currentPoint = currentSubCollider[j];
				
				if(currentPoint.Y < boundingBoxLocal.top) boundingBoxLocal.top = currentPoint.Y;
				if(currentPoint.Y > boundingBoxLocal.bottom) boundingBoxLocal.bottom = currentPoint.Y;
				if(currentPoint.X < boundingBoxLocal.left) boundingBoxLocal.left = currentPoint.X;
				if(currentPoint.X > boundingBoxLocal.right) boundingBoxLocal.right = currentPoint.X;
			}
		}

		boundingBoxLocal = {
			tl: new Nova.System.Vector2(boundingBoxLocal.left, boundingBoxLocal.top),
			tr: new Nova.System.Vector2(boundingBoxLocal.right, boundingBoxLocal.top),
			br: new Nova.System.Vector2(boundingBoxLocal.right, boundingBoxLocal.bottom),
			bl: new Nova.System.Vector2(boundingBoxLocal.left, boundingBoxLocal.bottom),
		}

		this.UpdateColliders();

		if(properties.hasOwnProperty('isSolid')) Nova.addSolid([this.Owner.GUID, this.componentName]);
		return true;
	}

	this.UpdateColliders = function() {
		var Transform = this.Owner.GetComponent("Transform");
		var Offset = Transform.GetLocalOrigin();
		subCollidersWorld = [];
		for(var i = 0; i < subCollidersLocal.length; i++) {
			var currentSubCollider = subCollidersLocal[i];
			var newSubCollider = [];
			for(var j = 0; j < currentSubCollider.length; j++) {
				var currentPoint = currentSubCollider[j].Copy();
				currentPoint.Translate(-Offset.X, -Offset.Y);
				currentPoint.RotateAround(new Nova.System.Vector2(), -Transform.GetAngle());
				currentPoint.Translate(Transform.Position.X, Transform.Position.Y);
				newSubCollider.push(currentPoint);
			}
			subCollidersWorld.push(newSubCollider);
		}
		this.UpdateBoundingBox();
	}

	this.UpdateBoundingBox = function() {
		var Transform = this.Owner.GetComponent("Transform")
		var Position = Transform.Position;

		var newCorners = {
			tl: boundingBoxLocal.tl.Copy(),
			tr: boundingBoxLocal.tr.Copy(),
			br: boundingBoxLocal.br.Copy(),
			bl: boundingBoxLocal.bl.Copy()
		}
		newCorners.tl.RotateAround(midpoint, -Transform.GetAngle());
		newCorners.tr.RotateAround(midpoint, -Transform.GetAngle());
		newCorners.br.RotateAround(midpoint, -Transform.GetAngle());
		newCorners.bl.RotateAround(midpoint, -Transform.GetAngle());

		var newEdges = {
			top: midpoint.Y,
			bottom: midpoint.Y,
			left: midpoint.X,
			right: midpoint.X
		}

		for(var c in newCorners) {
			var corner = newCorners[c];
			if(corner.Y < newEdges.top) newEdges.top = corner.Y;
			if(corner.Y > newEdges.bottom) newEdges.bottom = corner.Y;
			if(corner.X < newEdges.left) newEdges.left = corner.X;
			if(corner.X > newEdges.right) newEdges.right = corner.X;
		}

		var origin = Transform.GetLocalOrigin();
		newEdges.top += Position.Y - origin.Y;
		newEdges.bottom += Position.Y - origin.Y;
		newEdges.left += Position.X - origin.X;
		newEdges.right += Position.X - origin.X;

		boundingBoxWorld = newEdges;
	}

	this.Update = function() {
		this.UpdateColliders();

		var Transform = this.Owner.GetComponent("Transform");
		for(var i = 0; i < subCollidersWorld.length; i++) {
			var currentSubCollider = subCollidersWorld[i];
			Nova.Render.Path({
				Path: currentSubCollider,
				Fill: true,
				Complete: true,
				FillColour: 'red',
				StrokeColour: 'red'
			})
		}

		// console.log(boundingBoxWorld);
		// debugger;

		Nova.Render.Rectangle({
			Position: new Nova.System.Vector2(boundingBoxWorld.left, boundingBoxWorld.top),
			Size: new Nova.System.Vector2(boundingBoxWorld.right - boundingBoxWorld.left, boundingBoxWorld.bottom - boundingBoxWorld.top),
			StrokeColour: 'lime',
			FillColour: 'lime',
		})
	}

	this.GetSubColliders = function() {
		return subCollidersWorld;
	}

	this.GetBoundingBox = function() {
		return boundingBoxWorld;
	}

	this.GetBoundingBoxLocal = function() {
		return boundingBoxLocal;
	}
});
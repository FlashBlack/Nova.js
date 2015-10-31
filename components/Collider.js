"use strict";

Nova.Entities.NewComponent('Collider', function() {
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
		var Transform = this.Owner.GetComponent("Transform");
		var Position = Transform.Position;
		var origin = Transform.GetLocalOrigin();

		var newCorners = {
			tl: boundingBoxLocal.tl.Copy(),
			tr: boundingBoxLocal.tr.Copy(),
			br: boundingBoxLocal.br.Copy(),
			bl: boundingBoxLocal.bl.Copy()
		}
		newCorners.tl.RotateAround(origin, -Transform.GetAngle());
		newCorners.tr.RotateAround(origin, -Transform.GetAngle());
		newCorners.br.RotateAround(origin, -Transform.GetAngle());
		newCorners.bl.RotateAround(origin, -Transform.GetAngle());

		var newEdges = {}

		var xPositions = [];
		var yPositions = [];

		for(var c in newCorners) {
			var corner = newCorners[c];
			xPositions.push(corner.X);
			yPositions.push(corner.Y);
		}

		newEdges.top = Math.min.apply(null, yPositions) + (Position.Y - origin.Y);
		newEdges.bottom = Math.max.apply(null, yPositions) + (Position.Y - origin.Y);
		newEdges.left = Math.min.apply(null, xPositions) + (Position.X - origin.X);
		newEdges.right = Math.max.apply(null, xPositions) + (Position.X - origin.X);

		boundingBoxWorld = newEdges;
	}

	this.Update = function() {
		this.UpdateColliders();
		var Transform = this.Owner.GetComponent("Transform");

		Nova.Render.Line({
			Position: midpoint,
			Radius: 2,
			Fill: true
		})

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
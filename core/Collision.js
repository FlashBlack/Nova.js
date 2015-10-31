"use strict";

Nova.Collision = new function() {
	this.lineIntersects = function(p1, p2, p3, p4, getCollisionPoint) {
		function CCW(p1, p2, p3) {
			return (p3.X - p1.X) * (p2.Y - p1.Y) > (p2.X - p1.X) * (p3.Y - p1.Y);
		}
		var overlaps = (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4))
		if(overlaps) {
			if(getCollisionPoint) {
				var centerX = ((p1.X * p2.Y - p1.Y * p2.X) * (p3.X - p4.X) - (p1.X - p2.X) * (p3.X * p4.Y - p3.Y * p4.X)) /
								((p1.X - p2.X) * (p3.Y - p4.Y) - (p1.Y - p2.Y) * (p3.X - p4.X));
				var centerY = ((p1.X * p2.Y - p1.Y * p2.X) * (p3.Y - p4.Y) - (p1.Y - p2.Y) * (p3.X * p4.Y - p3.Y * p4.X)) /
								((p1.X - p2.X) * (p3.Y - p4.Y) - (p1.Y - p2.Y) * (p3.X - p4.X));
				return new Nova.System.Vector2(centerX, centerY);
			}
			return true;
		}
		return false;
	}

	this.PolygonCollision = function(a, b) {
		var polygons = [a, b];
		var minA, maxA, projected, i, i1, j, minB, maxB;

		for(var i = 0; i < polygons.length; i++) {
			var polygon = polygons[i];
			for(var i1 = 0; i1 < polygon.length; i1++) {
				var i2 = (i1 + 1) % polygon.length;
				var p1 = polygon[i1];
				var p2 = polygon[i2];

				var normal = new Nova.System.Vector2(p2.Y - p1.Y, p1.X - p2.X);

				minA = maxA = undefined;

				for(var j = 0; j < a.length; j++) {
					projected = normal.X * a[j].X + normal.Y * a[j].Y;
					if(typeof minA === 'undefined' || projected < minA) {
						minA = projected;
					}
					if(typeof maxA === 'undefined' || projected > maxA) {
						maxA = projected;
					}
				}

				minB = maxB = undefined;
				for(var j = 0; j < b.length; j++) {
					projected = normal.X * b[j].X + normal.Y * b[j].Y;
					if(typeof minB === 'undefined' || projected < minB) {
						minB = projected;
					}
					if(typeof maxB === 'undefined' || projected > maxB) {
						maxB = projected;
					}
				}
				if(maxA < minB || maxB < minA) {
					return false;
				}
			}
		}
		return true;
	}

	this.SpatialGrid = function(){}
	this.SpatialGrid.prototype.CellSize = 128;
	this.SpatialGrid.prototype.Update = function(){
		//Empty the grid!
		Nova.System.loopThroughObject(this, function(Cell, Entities){
			delete this[Cell];
		}.bind(this));

		var Entities = Nova.Entities.GetEntities('');
		Nova.System.loopThroughObject(Entities, function(GUID, Entity){
			if (Entity.GetComponent('Collider')){
				var	BoundingBox = Entity.GetComponent('Collider').GetBoundingBox();

				//get the position of the cells that the entity is overlaping
				var x = Math.floor(BoundingBox.left / this.CellSize),
					y = Math.floor(BoundingBox.top / this.CellSize),
					width = Math.floor(BoundingBox.right / this.CellSize),
					height = Math.floor(BoundingBox.bottom / this.CellSize);

				//add entity to all cells that it overlaps
				for (var i=x;i<=width;i++){
					for (var j=y;j<=height;j++){
						if (!this.hasOwnProperty(i+','+j)) this[i+','+j] = [];
						this[i+','+j].push(GUID);
					} 
				}
			}
		}.bind(this));
	}
	this.SpatialGrid.prototype.Render = function(){
			var size = { x: 8, y: 8 }; //make changable or something

			Nova.ctx.save();
			Nova.Viewport.Apply();

			Nova.ctx.fillStyle = '#000000';
			Nova.ctx.strokeStyle = '#000000';
			Nova.ctx.font = '24px Comic Sans MS';
			Nova.ctx.lineWidth = 2;
			Nova.ctx.beginPath();
			for (var i=0;i<size.x+1;i++){
				var x = i * this.CellSize;
				if (i < size.x) Nova.ctx.fillText(i, x+5, 24);
				Nova.ctx.moveTo(x, 0);
				Nova.ctx.lineTo(x, size.y*this.CellSize);
			}
			for (var i=0;i<size.y+1;i++){
				var y = i * this.CellSize;
				if (i < size.y)Nova.ctx.fillText(i, 5, y+24);
				Nova.ctx.moveTo(0, y);
				Nova.ctx.lineTo(size.x*this.CellSize, y);
			}
			Nova.ctx.stroke();

			Nova.ctx.restore();
	}
	this.SpatialGrid = new this.SpatialGrid();

	this.Overlaps = function(c1, c2) {

		if(!this.BBoxOverlaps(c1, c2)) return false;
		
		var c1Colliders = c1.GetSubColliders();
		var c2Colliders = c2.GetSubColliders();
		var hit = false;

		for(var i = 0; i < c1Colliders.length; i++) {
			for(var j = 0; j < c2Colliders.length; j++) {
				if(this.PolygonCollision(c1Colliders[i], c2Colliders[j])) hit = true;
			}
		}

		return hit;
	}

	this.BBoxOverlaps = function(c1, c2) {
		c1 = c1.GetBoundingBox();
		c2 = c2.GetBoundingBox();
		return (c1.left < c2.right &&
				c1.right > c2.left &&
				c1.top < c2.bottom &&
				c1.bottom > c2.top);
	}

	this.SubCollider = function(position, offset, size, angle) {
		if(!position.isVector2 || !offset.isVector2 || !size.isVector2) {
			console.error('Failed to create SubCollider, position and offset must be Vector2\'s');
			return false;
		}

		this.isSubCollider = true;
		this.Position = position.Copy();
		this.Offset = offset.Copy();
		this.Size = size.Copy();
		this.Angle = angle || 0;
	}
}
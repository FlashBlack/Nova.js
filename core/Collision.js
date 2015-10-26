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

	this.Overlaps = function(c1, c2) {
		var poly1 = c1.getPolygon();
		var poly2 = c2.getPolygon();
		if(!this.BBoxOverlaps(c1, c2)) return false;
		var hit = false;
		for(var i = 0; i < poly1.length; i++) {
			var start1 = poly1[i];
			
			if(i == poly1.length - 1) var end1 = poly1[0];
			else var end1 = poly1[i + 1];


			for(var j = 0; j < poly2.length; j++) {
				var start2 = poly2[j];
			
				if(j == poly2.length - 1) var end2 = poly2[0];
				else var end2 = poly2[j + 1];

				var collision = Nova.Collision.lineIntersects(start1, end1, start2, end2, true);
				if(collision) {
					Nova.Render.Line({
						Start: start1,
						End: end1
					})
					Nova.Render.Line({
						Start: start2,
						End: end2
					})
					Nova.Render.Arc({
						Position: collision,
						Radius: 2,
						Fill: true,
						FillColour: 'blue',
						StrokeColour: 'blue',
						StrokeAlpha: 1
					})
					hit = true;
				}
			}
		}
		return hit;
	}

	this.BBoxOverlaps = function(c1, c2) {
		return (c1.bboxleft < c2.bboxright &&
				c1.bboxright > c2.bboxleft &&
				c1.bboxtop < c2.bboxbottom &&
				c1.bboxbottom > c2.bboxtop);
	}
}

/*Nova.Collision = new function() {

	var Collision = function(normal, penetration) {
		this.normal = normal || 0;
		this.penetration = penetration || 0;
	}

	this.Overlaps = function(c1, c2) {
		if(!this.CollisionBoundingBox(c1, c2)) return false;
		var types = c1.GetType().concat(c2.GetType);
		switch(types) {
			case 'CircleCircle':
				return this.CollisionCircle(c1, c2);
			case 'RectangleRectangle':
				return this.CollisionRectangle(c1, c2);
		}
	}

	this.CollisionLine = function(p1, p2, p3, p4, getCollisionPoint) {
		function CCW(p1, p2, p3) {
			return (p3.X - p1.X) * (p2.Y - p1.Y) > (p2.X - p1.X) * (p3.Y - p1.Y);
		}
		return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
	}

	this.CollisionCircle = function(c1, c2) {
		if(c1.GetType() != 'Circle' || c2.GetType() != 'Circle') return false;
		var pos1 = c1.GetPosition();
		var pos2 = c2.GetPosition();
		var rad1 = c1.GetProperty('Radius');
		var rad2 = c2.GetProperty('Radius');
		var totalRadius = rad1 + rad2;
		var distance = Nova.System.distance(pos1, pos2)
		var collision = (distance <= totalRadius);
		if(collision) {
			return new Collision(Nova.System.angleTowards(c2, c1), totalRadius - distance);
		}
		return false;
	}

	this.CollisionRectangle = function(c1, c2) {
		if(c1.GetType() != 'Rectangle' || c2.GetType() != 'Rectangle') return false;
		var polygons
	}

	this.CollisionPolygon = function(c1, c2) {
		
	}

	this.CollisionBoundingBox = function(c1, c2) {
		return (c1.bboxleft < c2.bboxright &&
				c1.bboxright > c2.bboxleft &&
				c1.bboxtop < c2.bboxbottom &&
				c1.bboxbottom > c2.bboxtop);
	}
}*/
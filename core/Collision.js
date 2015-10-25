Nova.Collision = new function() {
	this.lineIntersects = function(p1, p2, p3, p4) {
		function CCW(p1, p2, p3) {
			/*Nova.Render.Path({
				Path: [p1, p2, p3],
				Complete: true,
				Fill: true
			})*/
			return (p3.X - p1.X) * (p2.Y - p1.Y) > (p2.X - p1.X) * (p3.Y - p1.Y);
		}
		var overlaps = (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4))
		if(overlaps) {
			var centerX = ((p1.X * p2.Y - p1.Y * p2.X) * (p3.X - p4.X) - (p1.X - p2.X) * (p3.X * p4.Y - p3.Y * p4.X)) /
							((p1.X - p2.X) * (p3.Y - p4.Y) - (p1.Y - p2.Y) * (p3.X - p4.X));
			var centerY = ((p1.X * p2.Y - p1.Y * p2.X) * (p3.Y - p4.Y) - (p1.Y - p2.Y) * (p3.X * p4.Y - p3.Y * p4.X)) /
							((p1.X - p2.X) * (p3.Y - p4.Y) - (p1.Y - p2.Y) * (p3.X - p4.X));
			Nova.Render.Rectangle({
				Position: new Nova.System.Vector2(centerX - 1, centerY - 1),
				Size: new Nova.System.Vector2(2, 2),
				Fill: true,
				FillColour: 'blue',
				StrokeColour: 'blue'
			})
		}
		return overlaps;
	}

	this.Overlaps = function(c1, c2) {
		var poly1 = c1.getPolygon();
		var poly2 = c2.getPolygon();
		if(!this.BBoxOverlaps(c1, c2)) return false;
		for(var i = 0; i < poly1.length; i++) {
			var start1 = poly1[i];
			
			if(i == poly1.length - 1) var end1 = poly1[0];
			else var end1 = poly1[i + 1];

			for(var j = 0; j < poly2.length; j++) {
				var start2 = poly2[j];
			
				if(j == poly2.length - 1) var end2 = poly2[0];
				else var end2 = poly2[j + 1];

				if(Nova.Collision.lineIntersects(start1, end1, start2, end2)) {
					/*Nova.Render.Line({
						Start: start1,
						End: end1
					})
					Nova.Render.Line({
						Start: start2,
						End: end2
					})*/
					return true;
				}
			}
		}
		return false;
	}

	this.BBoxOverlaps = function(c1, c2) {
		return (c1.bboxleft < c2.bboxright &&
				c1.bboxright > c2.bboxleft &&
				c1.bboxtop < c2.bboxbottom &&
				c1.bboxbottom > c2.bboxtop);
	}
}
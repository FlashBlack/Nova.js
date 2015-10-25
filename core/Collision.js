Nova.Collision = new function() {
	this.lineIntersects = function(p1, p2, p3, p4) {
		function CCW(p1, p2, p3) {
			return (p3.x - p1.x) * (p2.y - p1.y) > (p2.x - p1.x) * (p3.y - p1.y);
		}

		return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
	}

	this.Overlaps = function(c1, c2) {
		console.log(c1, c2);
	}
}
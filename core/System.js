Nova.System = new function() {
	this.GenerateGUID = function() {
		function _p8(s) {
        	var p = (Math.random().toString(16)+"000000000").substr(2,8);
        	return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    	}
    	return _p8() + _p8(true) + _p8(true) + _p8();
	}
	this.angleTowards = function(x1, y1, x2, y2) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		return this.toDegrees(Math.atan2(dy, dx));
	}
	this.distance = function(x1, y1, x2, y2) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	}
	this.rotateAround = function(pointX, pointY, originX, originY, angle) {
		angle = this.toRadians(angle) * -1;
		pointX++;
		pointY++;
		originX++;
		originY++;
	    return {
	        x: (Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX) - 1,
	        y: (Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY) - 1
	    };
	}
	this.lerp = function(a, b, x) {
		return a + x * (b - a);
	}
	this.angleLerp = function(a, b, x) {
		return a + ((((((b - a) % 360) + 540) % 360) - 180) * x);
	}
	this.clamp = function(x, a, b) {
		return Math.min(Math.max(x, a), b);
	}
	this.midpoint = function(x1, y1, x2, y2) {
		return {
			x: (x1 + x2) / 2,
			y: (y1 + y2) / 2
		}
	}
	this.toRadians = function(angle) {
		return angle * (Math.PI / 180);
	}
	this.toDegrees = function(angle) {
		return angle * (180 / Math.PI);
	}
}
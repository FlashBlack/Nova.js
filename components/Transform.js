Nova.NewComponent('Transform', function() {
	// default values
	this.Position = {
		x: 0,
		y: 0
	}
	var origin = {
		x: 0,
		y: 0
	}
	this.Anchor = {
		x: 0,
		y: 0
	}
	var Scale = 1;
	var Angle = 0;

	this.Create = function(properties) {
		// dont do anything if no properties were passed
		if(properties == undefined) return false;
		if(properties.hasOwnProperty('Position')) {
			this.Position.x = properties.Position.x;
			this.Position.y = properties.Position.y;
		}
		if(properties.hasOwnProperty('Anchor')) {
			origin.x = properties.Anchor.x,
			origin.y = properties.Anchor.y
			this.Anchor.x = properties.Anchor.x,
			this.Anchor.y = properties.Anchor.y
		}
	}

	this.SetPosition = function(x, y) {
		this.Position.x = x;
		this.Position.y = y;
	}

	this.SetScale = function(newScale) {
		Scale = newScale;
		var newOrigin = Nova.System.rotateAround(-origin.x * newScale, -origin.y * newScale, 0, 0, Angle);
		this.Anchor.x = -newOrigin.x;
		this.Anchor.y = -newOrigin.y;

	}

	this.SetAngle = function(newAngle) {
		if(newAngle < 0) newAngle = 360 + newAngle;
		newAngle = newAngle % 360;
		Angle = newAngle;
		var newOrigin = Nova.System.rotateAround(-origin.x, -origin.y, 0, 0, newAngle*-1);
		this.Anchor.x = -newOrigin.x;
		this.Anchor.y = -newOrigin.y;
	}

	this.GetOrigin = function() {
		return origin;
	}

	this.GetAngle = function() {
		return Angle;
	}

	this.GetScale = function() {
		return Scale;
	}

	this.MoveAtAngle = function(distance, direction) {
		direction = Nova.System.toRadians(direction);
		this.Position.x += distance * Math.cos(direction);
		this.Position.y += distance * Math.sin(direction);
	}

}, true);
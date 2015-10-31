Nova.NewComponent('Bullet', function() {
	this.Speed = 300;
	this.AngleOfMotion = 0;
	this.RotateTowards = true;

	this.Create = function(properties) {
		if(properties.hasOwnProperty('Speed')) this.Speed = parseFloat(properties.Speed);
		if(properties.hasOwnProperty('AngleOfMotion')) this.AngleOfMotion = properties.AngleOfMotion % 360;
		if(properties.hasOwnProperty('RotateTowards')) this.RotateTowards = properties.RotateTowards;

		return true;
	}

	this.Update = function() {
		var Transform = this.Owner.GetComponent("Transform");
		var Offset = new Nova.System.Vector2(this.Speed * Nova.dt, 0);
		Offset.RotateAround(new Nova.System.Vector2(), -this.AngleOfMotion);
		if(this.RotateTowards) {
			var Angle = Nova.System.AngleTowards(0, 0, Offset.X, Offset.Y);
			Transform.SetAngle(Angle);
		}
		// Transform.Position.Translate(Offset.X, Offset.Y);
	}
});
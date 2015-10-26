Nova.NewComponent('Transform', function() {
	// default values
	this.Position = new Nova.System.Vector2();
	// var localOrigin
	this.Anchor = new Nova.System.Vector2();

	var Scale = 1;
	var Angle = 0;

	this.Create = function(properties) {
		// dont do anything if no properties were passed
		if(!properties.hasOwnProperty("Position") || !properties.Position.isVector2) return false;
		if(!properties.hasOwnProperty('Origin') || !properties.Origin.isVector2) return false;
		this.Position = properties.Position.Copy();
		localOrigin = properties.Origin.Copy();
		this.UpdateOrigin();

		return true;
	}

	this.UpdateOrigin = function() {
		worldOrigin = new Nova.System.Vector2(localOrigin.X*-1, localOrigin.Y*-1);
		worldOrigin.Translate(this.Position.X, this.Position.Y);
		worldOrigin.RotateAround(this.Position, -Angle);
		// worldOrigin.Translate(-localOrigin.X, -localOrigin.Y);
		// console.log(this.Position);
		Nova.Render.Arc({
			Position: worldOrigin,
			Radius: 1,
		})
		Nova.Render.Arc({
			Position: this.Position,
			Radius: 1,
			StrokeColour: 'lime',
			FillColour: 'lime'
		})
	}

	this.SetPosition = function(x, y) {
		this.Position.Set(x, y);
	}

	this.SetScale = function(newScale) {
		Scale = newScale;
		this.UpdateOrigin();
	}

	this.SetAngle = function(newAngle) {
		if(newAngle < 0) newAngle = 360 + newAngle;
		newAngle = newAngle % 360;
		Angle = newAngle;
		this.UpdateOrigin();
	}

	this.GetAngle = function() {
		return Angle;
	}

	this.GetScale = function() {
		return Scale;
	}

	this.GetWorldOrigin = function() {
		return worldOrigin;
	}

	this.MoveAtAngle = function(distance, direction) {
		direction = Nova.System.toRadians(direction);
		this.Position.x += distance * Math.cos(direction);
		this.Position.y += distance * Math.sin(direction);
	}

}, true);
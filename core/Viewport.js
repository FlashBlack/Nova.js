Nova.Viewport = new function(){
	var actualPosition = new Nova.System.Vector2();
	var Position = new Nova.System.Vector2();
	var canvasSize = new Nova.System.Vector2();
	var Size = new Nova.System.Vector2();
	var Scale = new Nova.System.Vector2(1, 1);
	var Rotation = 0;

	this.Apply = function(){
		Nova.ctx.translate((+Size.X/2)*Scale.X, (+Size.Y/2)*Scale.Y);
		Nova.ctx.rotate(-Rotation * Math.PI/180);
		Nova.ctx.translate((-Size.X/2)*Scale.X, (-Size.Y/2)*Scale.Y);
		Nova.ctx.scale(Scale.X, Scale.Y);
		Nova.ctx.translate(-(actualPosition.X), -(actualPosition.Y));
	}

	this.SetPosition = function(x, y) {
		actualPosition.Set(parseFloat(x - (Size.X / 2)), parseFloat(y - (Size.Y / 2)))
		Position.Set(parseFloat(x), parseFloat(y));
		Nova.Input.UpdatePositions();
	}

	this.SetSize = function(width, height) {
		canvasSize.Set(width, height);
		Size.Set(width, height);
		delete this.SetSize;
	}

	this.SetScale = function(xScale, yScale) {
		Scale.Set(parseFloat(xScale), parseFloat(yScale));
		Size.Set(canvasSize.X / parseFloat(xScale), canvasSize.Y / parseFloat(yScale));
		this.SetPosition(Position.X, Position.Y);
		Nova.Input.UpdatePositions();
	}

	this.SetAngle = function(angle) {
		Rotation = Nova.System.angleLerp(Rotation, angle, 1);
		Nova.Input.UpdatePositions();
	}

	this.GetScale = function() {
		return new Nova.System.Vector2(Scale.X, Scale.Y);
	}

	this.GetSize = function() {
		return new Nova.System.Vector2(Size.X, Size.Y);
	}

	this.GetSizeReal = function() {
		return new Nova.System.Vector2(canvasSize.X, canvasSize.Y);
	}

	this.GetPosition = function() {
		return new Nova.System.Vector2(Position.X, Position.Y);
	}

	this.GetPositionReal = function() {
		return new Nova.System.Vector2(actualPosition.X, actualPosition.Y);
	}

	this.GetAngle = function() {
		return Rotation;
	}

	this.GetWorldPosition = function(vector) {
		var Position = this.GetPosition();
		Position.Translate(-(Size.X / 2), -(Size.Y / 2));

		var newPosition = new Nova.System.Vector2(((vector.X / canvasSize.X) * Size.X) + Position.X, ((vector.Y / canvasSize.Y) * Size.Y) + Position.Y);
		Position.Translate(Size.X / 2, Size.Y / 2);
		newPosition.RotateAround(Position, -Rotation)

		return newPosition;
	}
}
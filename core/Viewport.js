Nova.Viewport = new function(){
	var actualPosition = new Nova.System.Vector2();
	var Position = new Nova.System.Vector2();
	var canvasSize = new Nova.System.Vector2();
	var Size = new Nova.System.Vector2();
	var Scale = new Nova.System.Vector2(1, 1);
	var Rotation = 0;

	this.Apply = function(){
		Nova.ctx.translate(-actualPosition.X, -actualPosition.Y);
		Nova.ctx.translate(actualPosition.X + Size.X / 2, actualPosition.Y + Size.Y / 2);
		Nova.ctx.rotate(-Rotation * Math.PI/180);
		Nova.ctx.translate(-(Size.X / 2), -(Size.Y / 2))
		Nova.ctx.scale(Scale.X, Scale.Y);
		Nova.ctx.translate(-(actualPosition.X), -(actualPosition.Y));
	}

	this.SetPosition = function(x, y) {
		actualPosition.Set(parseFloat(x - (Size.X / 2)), parseFloat(y - (Size.Y / 2)))
		Position.Set(parseFloat(x), parseFloat(y));
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
	}

	this.SetAngle = function(angle) {
		Rotation = Nova.System.angleLerp(Rotation, angle, 1);
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
}
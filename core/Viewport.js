Nova.Viewport = new function(){
	this.Position = new Nova.System.Vector2();
	this.Size = new Nova.System.Vector2();
	this.Scale = new Nova.System.Vector2();
	this.rotation = 0;

	this.Apply = function(){
		Nova.ctx.translate(-this.Position.X, -this.Position.Y);
		Nova.ctx.translate(this.Position.X + (this.Size.X/2), this.Position.Y + (this.Size.Y/2));
		Nova.ctx.rotate(-this.rotation * Math.PI/180);
		Nova.ctx.scale(this.Scale.X, this.Scale.Y);
		Nova.ctx.translate(-(this.Position.X + (this.Size.X/2)), -(this.Position.Y + (this.Size.Y/2)));
	}
}
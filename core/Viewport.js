Nova.Viewport = new function(){
	this.Position = new Nova.System.Vector2();
	this.Size = new Nova.System.Vector2();
	this.Scale = new Nova.System.Vector2(1, 1);
	this.Rotation = 0;

	this.Apply = function(){
		Nova.ctx.translate(-Nova.Viewport.Position.X, -Nova.Viewport.Position.Y);
		Nova.ctx.translate(Nova.Viewport.Position.X + (Nova.Viewport.Size.X/2), Nova.Viewport.Position.Y + (Nova.Viewport.Size.Y/2));
		Nova.ctx.rotate(-Nova.Viewport.Rotation * Math.PI/180);
		Nova.ctx.scale(Nova.Viewport.Scale.X, Nova.Viewport.Scale.Y);
		Nova.ctx.translate(-(Nova.Viewport.Position.X + (Nova.Viewport.Size.X/2)), -(Nova.Viewport.Position.Y + (Nova.Viewport.Size.Y/2)));
	}
}
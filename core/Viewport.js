Nova.Viewport = new function(){
	this.position = new Nova.System.Vector2d();
	this.width = Nova.canvas.width;
	this.height = Nova.canvas.height;
	this.scaleX = 1;
	this.scaleY = 1;
	this.rotation = 0;

	this.Apply = function(){
		Nova.ctx.translate(-this.position.x, -this.position.y);
		Nova.ctx.translate(this.position.x + (this.width/2), this.position.y + (this.height/2));
		Nova.ctx.rotate(-this.rotation * Math.PI/180);
		Nova.ctx.scale(this.scaleX, this.scaleY);
		Nova.ctx.translate(-(this.position.x + (this.width/2)), -(this.position.y + (this.height/2)));
	}
}
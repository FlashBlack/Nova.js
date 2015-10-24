Nova.Render = new function() {
	this.Rectangle = function(properties) {
		if(!properties.hasOwnProperty('Position') || !properties.Position.isVector2) return false;
		if(!properties.hasOwnProperty('Size') || !properties.Size.isVector2) return false;
		Nova.ctx.fillStyle = properties.fillStyle || 'red';
	}
}
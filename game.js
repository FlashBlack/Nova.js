GCE.Start({
	canvas: 'game',
	frameRate: 1
})

GCE.CreateBlueprint('Player', {
	init: function(){
		this._super();
		this.AddComponet('Sprite');
	},
	update: function(){

	},
});
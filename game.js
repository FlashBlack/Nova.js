GCE.Start({
	canvas: 'game',
	sprites: ['player'],
	entities: ['Player']
})

GCE.Ready = function() {
	var player = GCE.CreateEntity('Player', {
		Transform: {
			Position: {
				x: 400,
				y: 300
			},
			Anchor: {
				x: 15,
				y: 56
			}
		},
		SpriteRenderer: {
			sprite: 'Player'
		}
	})
	$('#game').click(function(e) {
		GCE.GetEntityByID(player).GetComponent('Transform').SetPosition(e.offsetX, e.offsetY);
	})
}
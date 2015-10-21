GCE.Ready = function() {
	player = GCE.CreateEntity('Topdown', {
		Transform: {
			Position: {
				x: 400,
				y: 300
			},
			Anchor: {
				x: 16.5,
				y: 16.5
			}
		},
		SpriteRenderer: {
			sprite: 'Topdown',
			// drawAtInteger: true
		},
		EightDirection: {
			rotateTowards: false
		},
		Collider: {
			width: 33,
			height: 33,
			draw: true
		}
	})
	$('#game').click(function(e) {
		GCE.GetEntityByID(player).SetTarget(e.offsetX, e.offsetY);
		// GCE.GetEntityByID(player).GetComponent('Transform').SetPosition(e.offsetX, e.offsetY);
	})
	$(document).keypress(function(e) {
		var playerEntity = GCE.GetEntityByID(player);
		if(e.keyCode == 61) {
			playerEntity.SetSpeed(playerEntity.speed + 1);
		} else if(e.keyCode == 45) {
			playerEntity.SetSpeed(Math.max(playerEntity.speed - 1, 1));
		}
	})
}

GCE.Start({
	canvas: 'game',
	sprites: ['player', 'topdown'],
	entities: ['Player', 'Topdown']
})
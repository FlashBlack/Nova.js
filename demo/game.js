Nova.Ready = function() {
	for(var i = 0; i < 4; i++) {
		Nova.CreateEntity('Wall', {
			Transform: {
				Position: {
					x: 100 + i*32,
					y: 100
				}
			},
			SpriteRenderer: {
				sprite: 'Wall'
			},
			Collider: {
				isSolid: true,
				// draw: true
			}
		})
	}

	player = Nova.CreateEntity('Topdown', {
		Transform: {
			Position: {
				x: 400,
				y: 300
			},
			Anchor: {
				x: 16,
				y: 16
			}
		},
		SpriteRenderer: {
			sprite: 'Topdown',
			drawAtInteger: true
		},
		EightDirection: {
			rotateTowards: false
		},
		Collider: {
			draw: true
		}
	})


	$('#game').click(function(e) {
		Nova.GetEntityByID(player).SetTarget(e.offsetX, e.offsetY);
		// Nova.GetEntityByID(player).GetComponent('Transform').SetPosition(e.offsetX, e.offsetY);
	})
	$(document).keypress(function(e) {
		var playerEntity = Nova.GetEntityByID(player);
		if(e.keyCode == 61) {
			playerEntity.SetSpeed(playerEntity.speed + 1);
		} else if(e.keyCode == 45) {
			playerEntity.SetSpeed(Math.max(playerEntity.speed - 1, 1));
		}
	})
}

Nova.Start({
	canvas: 'game',
	sprites: ['player', 'topdown', 'wall'],
	entities: ['Player', 'Topdown', 'Wall'],
	sounds: ['laser9.mp3'],
	directories: {
		entities: '../entities/',
		components: '../components/',
		sprites: '../sprites/',
		images: '../images/',
		audio: '../audio/'
	}
})
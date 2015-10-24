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
				polygon: [
				[0, 0],
				[32, 0],
				[32, 32],
				[0, 32]],
				draw: true
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
			polygon: [
			[0, 0],
			[32, 0],
			[32, 32],
			[0, 32]],
			draw: true
		}
	})
}

Nova.Start({
	canvas: 'game',
	sprites: ['player', 'topdown', 'wall'],
	entities: ['Player', 'Topdown', 'Wall'],
	// sounds: ['laser9.mp3'],
	directories: {
		entities: '../entities/',
		components: '../components/',
		sprites: '../sprites/',
		images: '../images/',
		audio: '../audio/'
	}
})
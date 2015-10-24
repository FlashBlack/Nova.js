Nova.Ready = function() {
	/*for(var i = 0; i < 4; i++) {
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
	}*/
	Nova.CreateEntity('Grid', {
		Transform: {
			Position: {
				x: 0,
				y: 0
			}
		},
		SpriteRenderer: {
			sprite: 'Grid'
		}
	})

	player = Nova.CreateEntity('Topdown', {
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
	sprites: ['topdown', 'wall', 'grid', 'test'],
	entities: ['Topdown', 'Wall', 'Grid'],
	// sounds: ['laser9.mp3'],
	/*directories: {
		entities: '../entities/',
		components: '../components/',
		sprites: '../sprites/',
		images: '../images/',
		audio: '../audio/'
	}*/
})
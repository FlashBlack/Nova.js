Nova.Ready = function() {
	walls = [];
	Nova.CreateEntity('Level', {
		Transform: {
			x: 0,
			y: 0
		},
		TileRenderer: {
			Tilemap: 'Level001'
		},
	})
	for(var i = 0; i < 1; i++) {
		walls.push(Nova.CreateEntity('Wall', {
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
		}))
	}

	player = Nova.CreateEntity('Topdown', {
		Transform: {
			Position: {
				x: 400,
				y: 300
			},
			Anchor: {
				x: 7.5,
				y: 13.5
			}
		},
		SpriteRenderer: {
			sprite: 'Marine',
		},
		EightDirection: {
			rotateTowards: false
		},
		Collider: {
			polygon: [
			[0, 0],
			[37, 0],
			[37, 26],
			[0, 26]],
			draw: true
		}
	})
}

Nova.Start({
	canvas: 'game',
	fillKeepAspectRatio: false,
	pointFiltering: true,
	sprites: ['marine', 'wall', 'test'],
	entities: ['Topdown', 'Wall', 'Map'],
	maps: ['Level001'],
	sounds: ['laser9.mp3'],
	/*directories: {
		entities: '../entities/',
		components: '../components/',
		sprites: '../sprites/',
		images: '../images/',
		audio: '../audio/'
	}*/
})
Nova.Ready = function() {
	walls = [];
	level = Nova.CreateEntity('Level', {
		Transform: {
			Position: new Nova.System.Vector2(),
			Origin: new Nova.System.Vector2()
		},
		TileRenderer: {
			Tilemap: 'Level001'
		},
	})
	for(var i = 0; i < 1; i++) {
		walls.push(Nova.CreateEntity('Wall', {
			Transform: {
				Position: new Nova.System.Vector2(100+i*32, 100),
				Origin: new Nova.System.Vector2(0, 0)
			},
			SpriteRenderer: {
				sprite: 'Wall'
			},
			Collider: {
				SubColliders: [[[0, 0], [32, 0], [32, 32], [0, 32]]],
				isSolid: true,
				draw: true
			}
		}))
	}

	player = Nova.CreateEntity('Player', {
		Transform: {
			Position: new Nova.System.Vector2(180, 180),
			Origin: new Nova.System.Vector2(7.5, 13)
		},
		SpriteRenderer: {
			sprite: 'Marine',
		},
		EightDirection: {
			rotateTowards: false
		},
		Collider: {
			SubColliders: [[[0, 0], [16, 0], [16, 26], [0, 26]]],
						   // [[16, 11], [37, 11], [37, 16], [16, 16]]],
			draw: true
		}
	})
}

Nova.Start({
	canvas: 'game',
	fillKeepAspectRatio: false,
	pointFiltering: true,
	sprites: ['Marine', 'Wall', 'Bullet'],
	entities: ['Player', 'Wall', 'Map', 'Bullet'],
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
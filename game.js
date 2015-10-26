Nova.Ready = function() {
	walls = [];
	Nova.CreateEntity('Level', {
		Transform: {
			Position: new Nova.System.Vector2(0, 0),
			Origin: new Nova.System.Vector2(0, 0)
		},
		TileRenderer: {
			Tilemap: 'Level001'
		},
	})
	/*for(var i = 0; i < 1; i++) {
		walls.push(Nova.CreateEntity('Wall', {
			Transform: {
				Position: new Nova.System.Vector2(100+i*32, 100),
				Origin: new Nova.System.Vector2(0, 0)
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
	}*/

	player = Nova.CreateEntity('Topdown', {
		Transform: {
			Position: new Nova.System.Vector2(400, 300),
			Origin: new Nova.System.Vector2(16.5, 16.5)
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
	fillKeepAspectRatio: false,
	pointFiltering: true,
	sprites: ['topdown', 'wall', 'test'],
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
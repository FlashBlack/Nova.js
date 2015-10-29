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

	var MLGparticle = {
		Particle: function(properties){ //This is the constructor for each individual particle
			this.StartPosition = properties.Position.Copy() || new Nova.System.Vector2();
			this.Alpha = 0.1+Math.random()*2;
			var words = ['Wow', 'Rekt', 'M8', 'Weed', 'MLG', 'Comic Sans'];
			words.random = function(){ return Math.floor(Math.random()*words.length); };

			this.Reset = function(){
				this.Position = this.StartPosition.Copy();
				this.Velocity = new Nova.System.Vector2(75*Math.random()-37.5, 75*Math.random()-37.5);
				this.Alpha = 1+Math.random()*2;
				this.Colour = "#"+((1<<24)*Math.random()|0).toString(16);
				this.Text = words[words.random()];
			}

			this.Reset();
			this.Alpha = 0.1+Math.random()*2; //to make the start smoother
		},
		ParticleUpdate: function(Particle){ //this is run once for every particle per game loop
			if (Particle.Alpha < 0) Particle.Reset();
			Particle.Position.Translate(Particle.Velocity.X * Nova.dt, Particle.Velocity.Y * Nova.dt),
			Particle.Alpha -= 0.005;
			Nova.Render.Text({
				Position: Particle.Position,
				Text: Particle.Text,
				Colour: Particle.Colour,
				Alpha: Particle.Alpha,
				Size: 10,
			})
		},
	},

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
		},
		ParticleEmitter: MLGparticle,
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
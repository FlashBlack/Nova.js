Nova.Loader = new function() {
	var loaded = 0;
	var toLoad = 0;

	var Images = {};
	var Sprites = {};
	var Sounds = {};
	var LoadedImages = {};
	var LoadedSounds = {};

	var entitiesToLoad = [];
	var componentsToLoad = ["Collider", "EightDirection", "SpriteRenderer", "Transform"];
	var spritesToLoad = [];
	var soundsToLoad = [];

	var directories = {
		entities: 'entities/',
		components: 'components/',
		sprites: 'sprites/',
		images: 'images/',
		audio: 'audio/'
	}

	this.SetDirectory = function(directory, path) {
		if(directories.hasOwnProperty(directory)) {
			directories[directory] = path || directories[directory];
		}
	}

	// initialize Nova if the last object has been loaded. note: this does not include scripts
	this.LoadObject = function(name) {
		loaded++;
		if(loaded >= toLoad) {
			Nova.init();
		}
	};

	this.BeginLoad = function() {
		Nova.Input.Setup();

		// load the entities
		for(var i in entitiesToLoad) {
			var currentEntity = entitiesToLoad[i];
			toLoad++;
			$.ajax({
				url: directories.entities + currentEntity + '.js',
				dataType: 'script',
				success: Nova.Loader.LoadObject
			})
		}
		
		// load components
		for(var i in componentsToLoad) {
			var currentComponent = componentsToLoad[i];
			toLoad++;
			$.ajax({
				url: directories.components + currentComponent + '.js',
				dataType: 'script',
				success: Nova.Loader.LoadObject
			})
		}
		
		// load the sprites
		for(var i in spritesToLoad) {
			var currentSprite = spritesToLoad[i];
			toLoad++;
			// grab the sprite json from sprites/ folder and load it in
			$.getJSON(directories.sprites + currentSprite + '.json', function(data) {
				var sprite = data.image.split('.')[0];
				data.isSprite = true;
				Nova.Loader.LoadImage(sprite, data.image);
				Sprites[data.spriteName] = data;
				Nova.Loader.LoadObject();
			})
		}
		
		// load the audio
		for(var i in soundsToLoad) {
			var currentSound = soundsToLoad[i];
			this.LoadSound(currentSound.split('.')[0], currentSound);
		}
	}

	this.LoadImage = function(name, file) {
		// dont load the image if it has already been loaded, this allows multiple sprites to use the same image
		if(!LoadedImages.hasOwnProperty(name)) {
			toLoad++;
			LoadedImages[name] = true;
			var tempImage = new Image();
			tempImage.src = directories.images + file;
			tempImage.onload = function() {
				Images[name] = this;
				Nova.Loader.LoadObject();
			}
		}
	};

	this.LoadSound = function(name, file) {
		if(!LoadedSounds.hasOwnProperty(name)) {
			toLoad++;
			LoadedSounds[name] = true;
			var tempSound = new Audio();
			tempSound.src = directories.audio + file;
			tempSound.oncanplaythrough = function() {
				Sounds[name] = this;
				Nova.Loader.LoadObject();
			}
		}
	}

	this.LoadEntities = function(entities) {
		entitiesToLoad = entitiesToLoad.concat(entities);
	}
	
	this.LoadComponents = function(components) {
		componentsToLoad = componentsToLoad.concat(components);
	}
	
	this.LoadSprites = function(sprites) {
		spritesToLoad = spritesToLoad.concat(sprites);
	};

	this.LoadSounds = function(sounds) {
		soundsToLoad = soundsToLoad.concat(sounds);
	}

	this.GetImage = function(image) {
		// get image name from sprite if a sprite is passed
		if(typeof image === 'object') { image = image.image.split('.')[0]};
		if(Images.hasOwnProperty(image)) return Images[image];
		return false;
	};

	this.GetSprite = function(sprite) {
		if(Sprites.hasOwnProperty(sprite)) return Sprites[sprite];
		return false;
	};

	this.GetSound = function(sound) {
		if(Sounds.hasOwnProperty(sound)) return Sounds[sound];
		return false;
	}
}
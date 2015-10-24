Nova.Loader = new function() {
	var loaded = 0;
	var toLoad = 0;
	var Images = {};
	var Sprites = {};
	var LoadedImages = {};
	var scriptsToLoad = 0;
	var scriptsLoaded = 0;
	var spritesToLoad = [];
	var entitiesToLoad = [];
	var componentsToLoad = ["Collider", "EightDirection", "SpriteRenderer", "Transform"];
	var directories = {
		entities: 'entities/',
		components: 'components',
		sprites: 'sprites/',
		images: 'images/'
	}

	this.SetDirectory = function(directory, path) {
		if(directories.hasOwnProperty(directory)) {
			directories[directory] = path || directories[directory];
		}
	}

	// initialize Nova if the last object has been loaded. note: this does not include scripts
	this.LoadObject = function() {
		loaded++;
		if(loaded >= toLoad) Nova.init();
	};

	this.BeginLoad = function() {
		Nova.Input.Setup();
		// load the sprites
		for(var i in spritesToLoad) {
			var currentSprite = spritesToLoad[i];
			toLoad++;
			// grab the sprite json from sprites/ folder and load it in
			$.getJSON(directories.sprites + currentSprite + '.json', function(data) {
				var sprite = data.image.split('.')[0];
				Nova.Loader.LoadImage(sprite, data.image);
				Sprites[data.spriteName] = data;
				Nova.Loader.LoadObject();
			})
		}
		// load the entities
		for(var i in entitiesToLoad) {
			var currentEntity = entitiesToLoad[i];
			toLoad++;
			$.ajax({
				url: directories.entities + currentEntity + '.js',
				dataType: 'script',
				success: Nova.Loader.LoadObject,
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
	}

	this.LoadImage = function(name, file) {
		// dont load the image if it has already been loaded, this allows multiple sprites to use the same image
		if(!LoadedImages.hasOwnProperty(name)) {
			toLoad++;
			var tempImage = new Image();
			tempImage.src = directories.images + file;
			tempImage.onload = function() {
				Images[name] = this;
				Nova.Loader.LoadObject();
			}
		}
	};

	this.LoadSprites = function(sprites) {
		// assign the sprites array to spritesToLoad for loading later (after scripts)
		spritesToLoad = spritesToLoad.concat(sprites);
	};

	this.LoadEntities = function(entities) {
		entitiesToLoad = entitiesToLoad.concat(entities);
	}

	this.LoadComponents = function(components) {
		componentsToLoad = componentsToLoad.concat(components);
	}

	this.LoadScript = function() {
		scriptsLoaded++;
		if(scriptsLoaded >= scriptsToLoad) this.BeginLoad();
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
}
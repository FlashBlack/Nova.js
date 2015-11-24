define(['Nova/Audio'], function(Audio) {
    var Global = {},
        self = this,
        toLoad = 0,
        loaded = 0,
        images = {},
        sounds = {}, loadedSounds = {};
        
    var loadObject = function(objectName) {
        loaded++;
        //if(typeof objectName === "string") console.log("Loaded '" + objectName + "' " + loaded + "/" + toLoad);
        if(loaded >= toLoad) {
            Nova.initializeProcess();
        }
    }
    
    Global.loadImages = function() {
        var _images = Nova.getProject().Images;
        for(var i = 0; i < _images.length; i++) {
            var imageName = _images[i].split('.');
            imageName.splice(imageName.length - 1, 1);
            imageName = imageName.join('.');
            this.loadSprite(imageName, _images[i]);
        }
    }
    
    Global.loadAudio = function() {
        var _sounds = Nova.getProject().Audio;
        for(var i = 0; i < _sounds.length; i++) {
            var soundName = _sounds[i].split('.');
            soundName.splice(soundName.length - 1, 1);
            soundName = soundName.join('.');
            
            loadSound(soundName, _sounds[i]);
        }
    }
    
    var loadSound = function(name, file) {
        if(!loadedSounds[name]) {
            toLoad++;
            loadedSounds[name] = true;
            var request = new XMLHttpRequest();
            request.open('GET', 'audio/' + file, true);
            request.responseType = "arraybuffer";
            
            request.onload = function() {
                Audio._decode(request.response, function(data) {
                    Audio._addSound(name, data);
                    loadObject();
                }, function() {
                    console.error("Unable to load sound " + file);
                })
            }
            request.send();
        }
    }
    
    Global.loadSprite = function(spriteName, file) {
        toLoad++;
        PIXI.loader.add(spriteName, 'images/' + file).load(function(loader, resources) {
            // this will only store the texture. if the whole image object is needed in the future, just remove .texture
            images[spriteName] = resources[spriteName].texture;
            loadObject(file);
        })
    }
    
    Global.getImages = function() {
        return images;
    }
    
    Global.getSprite = function(imageName) {
        return images[imageName];
    }
    
    return Global;
})
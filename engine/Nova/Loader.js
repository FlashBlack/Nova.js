define(function() {
    var Global = {},
        toLoad = 0,
        loaded = 0,
        images = {};
        
    var loadObject = function(objectName) {
        loaded++;
        //if(typeof objectName === "string") console.log("Loaded '" + objectName + "' " + loaded + "/" + toLoad);
        if(loaded >= toLoad) {
            console.log('all assets loaded');
            Nova.init();
        }
    }
    
    Global.loadImages = function(images) {
        for(var i = 0; i < images.length; i++) {
            var imageName = images[i].split('.');
            imageName.splice(imageName.length - 1, 1);
            imageName = imageName.join('.');
            this.loadSprite('image_' + imageName, images[i]);
        }
    }
    
    Global.loadSprite = function(spriteName, file) {
        toLoad++;
        PIXI.loader.add(spriteName, 'images/' + file).load(function(loader, resources) {
            // this will only store the texture. if the whole image object is needed in the future, just remove .texture
            images[spriteName] = resources[spriteName].texture;
            loadObject(file);
            
            
            //var sprite = new PIXI.Sprite(resources[spriteName].texture);
            //Nova.getStage().addChild(sprite);
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
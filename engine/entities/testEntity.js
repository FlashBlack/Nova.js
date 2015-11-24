define([
    'Nova/Entity/Sprite',
    'Nova/System',
    'Nova/Input',
    'Nova/Audio'
], function(Sprite, System, Input, Audio){
    
    var testEntity = Sprite.extend({
        requiredComponents: ["EightDirection"],
        init: function(properties) {
            if(typeof properties.Sprite === "undefined") properties.Sprite = {};
            properties.Sprite.Image = 'player.png';
            properties.Sprite.Origin = new System.vector2(0.5, 0.5);
            
            this._super(properties);
            
            this.speed = 100;
            
            this.graphics = new PIXI.Graphics();
            Nova.getStage().addChild(this.graphics);
        },
        update: function() {
            if(Input.keyPressed('SPACE')) {
                Audio.play('laser9');
            }
            
            this._super();
        }
    });
    
    
    
    return testEntity;
});



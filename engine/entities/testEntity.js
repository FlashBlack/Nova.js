define([
    'Nova/Entity/Sprite',
    'Nova/System'
], function(Sprite, System){
    
    var testEntity = Sprite.extend({
        init: function(properties) {
            if(typeof properties.Sprite === "undefined") properties.Sprite = {};
            properties.Sprite.Image = 'player.png';
            
            this._super(properties);
            
            this.horizontal = 1;
            this.vertical = 1;
        },
        update: function() {
            this.position.x += (100 * Nova.dt) * this.horizontal;
            this.position.y += (100 * Nova.dt) * this.vertical;
            
            if(this.position.x + this.sprite.width >= 800) this.horizontal = -1;
            else if(this.position.x <= 0) this.horizontal = 1;
            
            if(this.position.y + this.sprite.height >= 600) this.vertical = -1;
            else if(this.position.y <= 0) this.vertical = 1;
            
            this.sprite.rotation += System.toRadians(180 * Nova.dt);
            
            // if(this.position.x + >)
            
            this._super();
        }
    });
    
    
    
    return testEntity;
});



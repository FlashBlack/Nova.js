var player;

Nova.Ready = function() {
    require(['Nova/Entities', 'Nova/System'], function(Entities, System) {
        player = Entities.getEntityByID(Entities.createEntity('testEntity', {
            Sprite: {
                DrawBounds: true
            },
            EightDirection: {
                property: 7
            },
            Position: new System.vector2(400,300)
        }));
    })
}

Nova.start('Project.json');
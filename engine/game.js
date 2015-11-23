var test;

Nova.Ready = function() {
    require(['Nova/Entities'], function(Entities) {
        test = Entities.createEntity('testEntity', {})
    })
}

Nova.Start('Project.json');
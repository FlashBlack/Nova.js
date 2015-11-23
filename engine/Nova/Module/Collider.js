define(['Nova/System'], function(System) {
    var Collider = function()  {
        var polygon = [];
        
        this.addPoint = function(pos, index) {
            if(!pos.isVector2) return false;
            if(!index) index = polygon.length;
            polygon.splice(index, 0, pos);
        }
        
        this.removePoint = function(index) {
            if(polygon.length <= 3) return false;
            polygon.splice(index, 1);
        }
        
        this.setPolygon = function(newPolygon) {
            if(newPolygon.length <= 3 || !Array.isArray(newPolygon)) return false;
            var newPoly = [];
            
            for(var i = 0; i < newPolygon.length; i++) {
                if(!newPolygon[i].isVector2) return false;
                newPoly.push(newPolygon[i]);
            }
            polygon = newPoly;
        }
        
        // initialize a default polygon
        for(var i = 0; i < 2; i++) {
            this.addPoint(new System.vector2());
        }
    }
    
    return Collider;
})
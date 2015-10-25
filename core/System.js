Nova.System = new function() {
	var UserAgent = (function() {
		var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
		var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		    // At least Safari 3+: "[object HTMLElementConstructor]"
		var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
		var isIE = /*@cc_on!@*/false || !!document.documentMode;

		if(isOpera) return 'Opera';
		if(isFirefox) return 'Firefox';
		if(isSafari) return 'Safari';
		if(isChrome) return 'Chrome';
		if(isIE) return 'Internet Explorer';
		return 'Unknown';
	})();

	this.GetUserAgent = function() {
		return UserAgent;
	}

	this.GenerateGUID = function() {
		function _p8(s) {
        	var p = (Math.random().toString(16)+"000000000").substr(2,8);
        	return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    	}
    	return _p8() + _p8(true) + _p8(true) + _p8();
	}
	this.angleTowards = function(x1, y1, x2, y2) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		return this.toDegrees(Math.atan2(dy, dx));
	}
	this.distance = function(x1, y1, x2, y2) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	}
	this.rotateAround = function(pointX, pointY, originX, originY, angle) {
		angle = this.toRadians(angle) * -1;
		pointX++;
		pointY++;
		originX++;
		originY++;
	    return {
	        x: (Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX) - 1,
	        y: (Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY) - 1
	    };
	}
	this.lerp = function(a, b, x) {
		return a + x * (b - a);
	}
	this.angleLerp = function(a, b, x) {
		return a + ((((((b - a) % 360) + 540) % 360) - 180) * x);
	}
	this.clamp = function(x, a, b) {
		return Math.min(Math.max(x, a), b);
	}
	this.midpoint = function(x1, y1, x2, y2) {
		return {
			x: (x1 + x2) / 2,
			y: (y1 + y2) / 2
		}
	}
	this.toRadians = function(angle) {
		return angle * (Math.PI / 180);
	}
	this.toDegrees = function(angle) {
		return angle * (180 / Math.PI);
	}
	this.loopThroughObject = function(object, callback){
		for (var prop in object){
			if (object.hasOwnProperty(prop)){
				callback(prop, object[prop]);
			}
		}
	}
	this.Vector2 = function(x, y) {
		this.X = parseFloat(x) || 0;
		this.Y = parseFloat(y) || 0;
		this.isVector2 = true;

		this.Transform = function(x, y) {
			this.X += parseFloat(x);
			this.Y += parseFloat(y);
		}

		this.Set = function(x, y) {
			this.X = parseFloat(x);
			this.Y = parseFloat(y);
		}

		this.RotateAround = function(vector, angle) {
			var radians = Nova.System.toRadians(angle) * -1;
			if(vector.X == 0 && vector.X == 0) {
				this.X = (Math.cos(radians) * ((this.X+1)-(vector.X+1)) - Math.sin(radians) * ((this.Y+1)-(vector.Y+1)) + (vector.X+1))-1,
	        	this.Y = (Math.sin(radians) * ((this.X+1)-(vector.X+1)) + Math.cos(radians) * ((this.Y+1)-(vector.Y+1)) + (vector.Y+1))-1
	        	return;
			}
	        this.X = (Math.cos(radians) * (this.X-vector.X) - Math.sin(radians) * (this.Y-vector.X) + vector.X),
	        this.Y = (Math.sin(radians) * (this.X-vector.X) + Math.cos(radians) * (this.Y-vector.X) + vector.Y)
		}
	}
	this.SetDefaultProperties = function(properties, defaultProperties) {
		for(var p in properties) {
			if (properties.hasOwnProperty(p)){
				var currentProperty = properties[p];
				if(!defaultProperties.hasOwnProperty(p)) {
					defaultProperties[p] = currentProperty;
				} 
				// if the type matches, set the passed value. else leave as default
				else if(typeof defaultProperties[p] == typeof currentProperty) {
					defaultProperties[p] = currentProperty;
				}
			}
		}
		return defaultProperties;
	}

	/*
		loopThroughEntities EXAMPLE:
		var entities = {}

		GCE.System.loopThroughEntities(entities, function(GUID, Entity){
			Entity.update();
		});
	*/
}
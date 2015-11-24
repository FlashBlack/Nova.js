define(function() {
    var Global = {};
    var currentSeed = 1;
    
    var userAgent = (function() {
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
	
	this.getUserAgent = function() {
		return userAgent;
	}
    
    Global.lerp = function(start, finish, strength){
		return start + strength * (finish - start);
	}
	
	Global.angleLerp = function(start, finish, strength){
		return start + ((((((finish - start) % 360) + 540) % 360) - 180) * strength);
	}
	
	Global.clamp = function(value, min, max){
		return Math.min(Math.max(value, min), max);
	}
	
	Global.angleTowards = function(p1, p2) {
	    var dx = p2.x - p1.x;
	    var dy = p2.y - p1.y;
	    return this.toDegrees(Math.atan2(dy, dx))
	}
	
	Global.toRadians = function(angle) {
	    return angle * (Math.PI / 180);
	}
	
	Global.toDegrees = function(radian) {
	    return radian * (180 / Math.PI);
	}
	
	Global.choose = function(choices) {
		if(arguments.length == 1) {
			if(Array.isArray(choices)) {
				return choices[Math.floor(Math.random() * choices.length)];
			}
			return choices;
		}
		return arguments[Math.floor(Math.random() * arguments.length)];
	}
	
    Global.generateUID = function() {
        var time = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var random = (time + Math.random()*16)%16 | 0;
			time = Math.floor(time/16);
			return (c=='x' ? random : (random&0x3|0x8)).toString(16);
		});
		return uuid;
    }
    
    Global.seed = function(setSeed){
		if (setSeed) currentSeed = setSeed;
		var seed = Math.sin(currentSeed+1)*10000;
		return seed - Math.floor(seed);
	}
	
	Global.vector2 = function(x, y) {
	    this.x = parseFloat(x) || 0;
	    this.y = parseFloat(y) || 0;
	    this.isVector2 = true;
	    
	    this.translate = function(x, y) {
	        this.x += parseFloat(x);
	        this.y += parseFloat(y);
	        return this;
	    }
	    
	    this.set = function(x, y) {
	        this.x = parseFloat(x);
	        this.y = parseFloat(y);
	        return this;
	    }
	    
	    this.subtract = function(x, y) {
	        this.x -= parseFloat(x);
	        this.y -= parseFloat(y);
	        return this;
	    }
	    
	    this.copy = function() {
	        return new Nova.System.vector2(this.x, this.y);
	    }
	}
	
    return Global;
});
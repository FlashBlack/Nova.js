Nova.Input = new function() {
	var keyCodes = {"BACK": 8, "TAB": 9, "ENTER": 13, "SHIFT": 16, "CTRL": 17, "ALT": 18, "BREAK": 19, "CAPS": 20, "ESCAPE": 27, "SPACE": 32, "PGUP": 33, "PGDOWN": 34, "END": 35, "HOME": 36, "LEFT": 37, "UP": 38, "RIGHT": 39, "DOWN": 40, "INSERT": 45, "DELETE": 46, 
	"0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57,
	"A": 65, "B": 66, "C": 67, "D": 68, "E": 69, "F": 70, "G": 71, "H": 72, "I": 73, "J": 74, "K": 75, "L": 76, "M": 77, "N": 78, "O": 79, "P": 80, "Q": 81, "R": 82, "S": 83, "T": 84, "U": 85, "V": 86, "W": 87, "X": 88, "Y": 89, "Z": 90,
	"LEFTWINDOW": 91, "RIGHTWINDOW": 92, "SELECT": 93, "NUM0": 96, "NUM1": 97, "NUM2": 98, "NUM3": 99, "NUM4": 100, "NUM5": 101, "NUM6": 102, "NUM7": 103, "NUM8": 104, "NUM9": 105, "MULTIPLY": 106, "ADD": 107, "SUBTRACT": 109, "DECIMAL": 110, "DIVIDE": 111,
	"F1": 112, "F2": 113, "F3": 114, "F4": 115, "F5": 116, "F6": 117, "F7": 118, "F8": 119, "F9": 120, "F10": 121, "F11": 122, "F12": 123, "NUMLOCK": 144, "SCROLLLOCK": 145, "COLON": 186, "EQUALS": 187, "COMMA": 188,
	"DASH": 189, "PERIOD": 190, "SLASH": 191, "TILDE": 192, "OPENBRACKET": 219, "BACKSLASH": 220, "CLOSEBRACKET": 221, "APOSTROPHE": 222
	};
	
	var charCodes = [];
	var keys = {};
	var pressed = {};
	var released = {};
	this.mousex = 0;
	this.mousey = 0;
	for(var key in keyCodes) {
		charCodes[keyCodes[key]] = key;
		keys[key] = false;
		pressed[key] = false;
		released[key] = false;
	}

	this.Setup = function() {
		$(window).bind('keydown', function(e) {
			var keyCode = e.keyCode || e.which;
			var charCode = charCodes[keyCode];
			if(!keys[charCode]) { pressed[charCode] = true;	}
			keys[charCode] = true;
		})
		$(window).bind('keyup', function(e) {
			var keyCode = e.keyCode || e.which;
			var charCode = charCodes[keyCode];
			released[charCode] = true;
			keys[charCode] = false;
		})
		$(Nova.canvas).mousemove(function(e) {
			Nova.Input.mousex = e.offsetX;
			Nova.Input.mousey = e.offsetY;
		})
	}

	this.UpdateKeys = function() {
		for(var key in keys) {
			pressed[key] = false;
			released[key] = false;
		}
	}

	this.KeyDown = function(key) {
		if(typeof key === 'number') key = charCodes[key];
		if(keys[key]) return true;
		return false;
	}

	this.KeyPress = function(key) {
		if(typeof key === 'number') key = charCodes[key];
		if(pressed[key]) return true;
		return false;
	}

	this.KeyUp = function(key) {
		if(typeof key === 'number') key = charCodes[key];
		if(released[key]) return true;
		return false;
	}
}
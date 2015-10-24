Nova.Audio = new function() {
	this.Play = function(sound) {
		var sound = Nova.Loader.GetSound(sound);
		if(sound) {
			var playSound = new Audio();
			playSound.src = sound.src;
			playSound.play();
		}
	}
}
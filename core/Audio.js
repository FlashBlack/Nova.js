Nova.Audio = new function() {
	this.Play = function(sound) {
		/*var sound = Nova.Loader.GetSound(sound);
		if(sound) {
			var playSound = new Audio();
			playSound.src = sound.src;
			playSound.play();
		}*/
		console.warn('borked. dont use');
	}
}

// frinlets load stuff
/*audio.loadFile = function(file, name) {
    if(!audio.sounds[name]) audio.sounds[name] = [];
    var request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
            audio.context.decodeAudioData(request.response, function(data) {
                    audio.sounds[name].bufferData = data;
                    audio.sounds.loaded++;
            }, function(){
                    console.log("ERROR: could not load sound! "+"Name: "+name+", File: "+file)
            } );
    }
    loader("loading audio<br>"+name+"<br>");
    request.send();
}*/


// finlets play stuff
/*audio.play = function(name, v) {
    if(audio.sounds[name].bufferData) {
            if(!audio.files[name]) return console.log("error: sound object not found", audio.files[name], name);
            var index = audio.buffers.length;
            audio.buffers[index] = {};
            var buffer = audio.buffers[index];
            buffer.source = audio.context.createBufferSource();
            buffer.gainNode = audio.context.createGain();

            buffer.source.onended = function() {clearAudioBuffer(index);};

            var properties = audio.files[name];

            if(properties.loop) buffer.source.loop = true;
            buffer.source.connect(buffer.gainNode);
            if(!v) buffer.gainNode.gain.value = 1*game.settings.volume;//Math.clamp((1*game.settings.volume)*audio.sounds[name].volumeAdjust);
            else   buffer.gainNode.gain.value = 1*game.settings.volume;//Math.clamp((v*game.settings.volume)*audio.sounds[name].volumeAdjust);

            buffer.source.buffer = audio.sounds[name].bufferData;

            buffer.gainNode.connect(audio.context.destination);

            buffer.source.playbackRate.value = properties.speed();

            buffer.source.start();
    }
    else {
            console.log("ERROR: Sound not loaded!",name);
    }
}

var audio = {};
audio.sounds = {
    loaded: 0,
}

audio.init = function() {
    audio.context = new AudioContext();
    audio.loadFile(audio.files.voice.file,"voice");
    audio.loadFile(audio.files.swing.file,"swing");
    audio.loadFile(audio.files.drop.file,"drop");
}

audio.buffers = [];

audio.play = function(name, v) {
    if(audio.sounds[name].bufferData) {
        if(!audio.files[name]) return console.log("error: sound object not found", audio.files[name], name);
        var index = audio.buffers.length;
        audio.buffers[index] = {};
        var buffer = audio.buffers[index];
        buffer.source = audio.context.createBufferSource();
        buffer.gainNode = audio.context.createGain();

        buffer.source.onended = function() {clearAudioBuffer(index);};

        var properties = audio.files[name];

        if(properties.loop) buffer.source.loop = true;
        buffer.source.connect(buffer.gainNode);
        if(!v) buffer.gainNode.gain.value = 1*game.settings.volume;//Math.clamp((1*game.settings.volume)*audio.sounds[name].volumeAdjust);
        else   buffer.gainNode.gain.value = 1*game.settings.volume;//Math.clamp((v*game.settings.volume)*audio.sounds[name].volumeAdjust);

        buffer.source.buffer = audio.sounds[name].bufferData;

        buffer.gainNode.connect(audio.context.destination);

        buffer.source.playbackRate.value = properties.speed();

        buffer.source.start();
    }
    else {
        console.log("ERROR: Sound not loaded!",name);
    }
}


audio.stop = function(name) {

}

audio.loadFile = function(file, name) {
    if(!audio.sounds[name]) audio.sounds[name] = [];
    var request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        audio.context.decodeAudioData(request.response, function(data) {
            audio.sounds[name].bufferData = data;
            audio.sounds.loaded++;
        }, function(){
            console.log("ERROR: could not load sound! "+"Name: "+name+", File: "+file)
        } );
    }
    loader("loading audio<br>"+name+"<br>");
    request.send();
}

function clearAudioBuffer(index) {
    if(audio.buffers[index].source) audio.buffers[index].source.stop();
    audio.buffers[index] = null;
}

audio.files = {
    voice: {
        file:"audio/voice.mp3",
        loop: 1,
        speed: function(){return 0.7+seededRand(game.dialog.seed)*1.0;}
    },
    drop: {
        file:"audio/drop.mp3",
        loop: 0,
        speed: function(){return 1;}
    },
    swing: {
        file:"audio/swing.wav",
        loop: 0,
        speed: function(){return 0.7+Math.random()*0.5;}
    }
}*/
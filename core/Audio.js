Nova.Audio = new function() {
    var context = new AudioContext();
    var Sounds = {};
    var buffers = [];

    var clearAudioBuffer = function(index) {
        if(buffers[index].source) buffers[index].source.stop();
        buffers[index] = null;
    }

    this.Decode = function(response, callback, error) {
        context.decodeAudioData(response, callback, error);
    }

    this.AddSound = function(name, data) {
        if(Sounds[name]) return false;
        Sounds[name] = [];
        Sounds[name].bufferData = data;
    }

	this.Play = function(name, properties) {
    	if(Sounds[name].bufferData) {
            var index = buffers.length;
            buffers[index] = {};
            var buffer = buffers[index];
            buffer.source = context.createBufferSource();
            buffer.gainNode = context.createGain();

            buffer.source.onended = function() { clearAudioBuffer(index); }

            buffer.source.connect(buffer.gainNode);
            buffer.gainNode.gain.value = 1;

            buffer.source.buffer = Sounds[name].bufferData;
            buffer.gainNode.connect(context.destination);
            buffer.source.playbackRate.value = 1;

            buffer.source.start();
        }
	}
}
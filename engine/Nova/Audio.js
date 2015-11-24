define(function() {
    var Global = {};
    
    var context = new AudioContext();
    var sounds = {};
    var buffers = [];
    
    var clearAudioBuffer = function(index) {
        if(buffers[index].source) buffers[index].source.stop();
        buffers[index] = null;
    }
    
    Global._decode = function(response, callback, error) {
        context.decodeAudioData(response, callback, error);
    }
    
    Global._addSound = function(name, data) {
        if(sounds[name]) return false;
        sounds[name] = [];
        sounds[name].bufferData = data;
    }
    
    Global.play = function(name, properties) {
        if(sounds[name].bufferData) {
            var index = buffers.length;
            buffers[index] = {};
            var buffer = buffers[index];
            buffer.source = context.createBufferSource();
            buffer.gainNode = context.createGain();
            
            buffer.source.onended = function() { clearAudioBuffer(index); }
            
            buffer.source.connect(buffer.gainNode);
            buffer.gainNode.gain.value = 1;
            
            buffer.source.buffer = sounds[name].bufferData;
            buffer.gainNode.connect(context.destination);
            buffer.source.playbackRate.value = 1;
            
            buffer.source.start();
        }
    }
    
    return Global;
})
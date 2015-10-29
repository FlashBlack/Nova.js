"use strict";

Nova.NewComponent('ParticleEmitter', function() {

	var Particles = [];

	this.Create = function(properties) {
		if(properties.hasOwnProperty("ParticleUpdate")) this.ParticleUpdate = properties.ParticleUpdate;
		if(properties.hasOwnProperty("Particle")) this.Particle = properties.Particle;

		return true;
	}
	this.Update = function(){
		for (var i=0;i<Particles.length;i++){
			this.ParticleUpdate(Particles[i]);
		}
	}
	this.Particle = function(properties){
		this.Position = properties.Position.Copy() || new Nova.System.Vector2();
	}
	this.ParticleUpdate = function(Particle){

	}
	this.AddParticles = function(Amount, properties){
		for (var i=0;i<Amount;i++){
			Particles.push(new this.Particle(properties));
		}
	}
}, true);
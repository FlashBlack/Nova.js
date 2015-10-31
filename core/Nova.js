"use strict";

var Nova = new function() {
	this.VERSION = '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.2';

	// becomes true when all assets are loaded, and Nova.Ready() is called
	var isReady = false;
	var started = false;
	this.isReady = function() { return isReady; };

	var Solids = [];

	this.Ready = function() {};
	this.dt = 0;

	// time of last update, used for deltatime
	var lastUpdate;
	var gameLoop = function() {
		var now = performance.now();
		Nova.dt = (now - lastUpdate) / 1000;
		Nova.fps = Math.round(1 / Nova.dt);
		lastUpdate = now;

		// fill canvas with background colour
		Nova.ctx.fillStyle = 'grey';
		Nova.ctx.fillRect(0, 0, Nova.canvas.width, Nova.canvas.height);

		// update all entities
		UpdateEntities();

		// update spacial grid;
		Nova.Collision.SpatialGrid.Update();
		Nova.Collision.SpatialGrid.Render();

		Nova.Debug.Update();

		Nova.Input.UpdateInput();

		// do loop again
		requestAnimationFrame(gameLoop);
	}

	// this is the last function to be called for ready state, it actually starts the loop after calling Nova.Ready()
	this.init = function() {
		isReady = true;
		this.Ready();
		lastUpdate = performance.now();
		requestAnimationFrame(gameLoop);
		// overwrite init function so it cant be used again
		this.init = function() { console.warn('The game has already been initialized!') }
	}
	
	// used to setup Nova sprites, entities, components, images, parameters, etc.
	this.Start = function(parameters) {
		// required parameters
		var defaultParameters = {
			sprites: [],
			entities: [],
			sounds: [],
			tilemaps: [],
			fillKeepAspectRatio: false,
			pointFiltering: true,
		};
		// get default parameters if something is missing
		parameters = this.System.SetDefaultProperties(parameters, defaultParameters);

		// ensure that a canvas id was passed
		if (!parameters.hasOwnProperty('canvas')) {
			console.error('Canvas ID must be passed!');
			return false; //if no canvas was passed exit early
		}

		if(parameters.hasOwnProperty('directories')) {
			var dirs = parameters.directories;
			this.Loader.SetDirectory('entities', dirs.entities);
			this.Loader.SetDirectory('components', dirs.components);
			this.Loader.SetDirectory('sprites', dirs.sprites);
			this.Loader.SetDirectory('images', dirs.images);
			this.Loader.SetDirectory('audio', dirs.audio);
			this.Loader.SetDirectory('maps', dirs.maps);
		}

		// ensure the passed ID exists
		var canvas = document.getElementById(parameters.canvas);
		if(canvas == undefined) {
			console.error('Invalid Canvas ID!');
			return false;
		} else {
			// finding the canvas was a success
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.ctx.fillStyle = 'black';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			// draw loading bar here?
		}

		Nova.ctx.mozImageSmoothingEnabled = !parameters.pointFiltering;
		Nova.ctx.webkitImageSmoothingEnabled = !parameters.pointFiltering;
		Nova.ctx.msImageSmoothingEnabled = !parameters.pointFiltering;
		Nova.ctx.imageSmoothingEnabled = !parameters.pointFiltering;
		Nova.ctx.imageSmoothingEnabled = !parameters.pointFiltering;

		if (parameters.fillKeepAspectRatio) fillKeepAspectRatio(this.canvas);
		function fillKeepAspectRatio(canvas) {
			canvas.style.position = 'absolute';
			canvas.style.left = '50%';
			canvas.style.marginLeft = -canvas.width/2+'px';

			var style = canvas.getAttribute('style') || '';
			window.addEventListener('resize', function () {resize(canvas);}, false);
			resize(canvas);

			function resize(canvas) {
				var scale = {x: 1, y: 1};
				scale.x = (window.innerWidth - 10) / canvas.width;
				scale.y = (window.innerHeight - 10) / canvas.height;
				
				if (scale.x < 1 || scale.y < 1) {
					scale = '1, 1';
				} else if (scale.x < scale.y) {
					scale = scale.x + ', ' + scale.x;
				} else {
					scale = scale.y + ', ' + scale.y;
				}
				
				canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
			}
		}

		this.Viewport.SetSize(this.canvas.width, this.canvas.height);
		this.Render.SetContext(this.ctx);

		this.Loader.LoadSprites(parameters.sprites);
		this.Loader.LoadEntities(parameters.entities);
		this.Loader.LoadSounds(parameters.sounds);
		this.Loader.LoadTilemaps(parameters.maps);

		if(parameters.hasOwnProperty('jQueryIncluded') && parameters.jQueryIncluded) { this.Loader.BeginLoad(); }
		else { LoadJQuery() }
	}

	function UpdateEntities() {

		var zOrder = Nova.Entities.GetZOrder();

		for(var i = 0; i < zOrder.length; i++) {
			var currentEntity = Nova.Entities.GetEntityByID(zOrder[i]);
			
			for(var j = 0; j < currentEntity.PreUpdate.length; j++) {
				currentEntity.Components[currentEntity.PreUpdate[j]].Update();
			}
			
			currentEntity.Update();
			
			for(var j = 0; j < currentEntity.PostUpdate.length; j++) {
				currentEntity.Components[currentEntity.PostUpdate[j]].Update();
			}
		}
	}

	function LoadJQuery() {
		var newScript = document.createElement('script');
		newScript.src = 'https://code.jquery.com/jquery-1.11.3.min.js'
		newScript.onload = function() {
			Nova.Loader.BeginLoad();
		}
		document.getElementsByTagName('head')[0].appendChild(newScript);
	}

	this.addSolid = function(solid) {
		Solids.push(solid);
	}

	this.getSolids = function() {
		var allSolids = [];
		for(var i = 0; i < Solids.length; i++) {
			var object = Nova.Entities.GetEntityByID(Solids[i][0]).GetComponent(Solids[i][1]);
			if(object) allSolids.push(object);
		}
		return allSolids;
	}
}

var COLON = console;
COLON.insert = function(){
	console.log("                   ____\n"+
"              /  /'    `\\  \\\n"+
"              \\ (   )(   ) /\n"+
"               \\{~~~~~~~~}/\n"+
"                {   /\\   }\n"+
"                {  }  {  }\n"+
"               {  }    {  }\n"+
"              {- }      { -}\n"+
"             _| |        | |_\n"+
"             \\[ ]        [ ]/"
	);
}
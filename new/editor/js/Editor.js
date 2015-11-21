$(document).ready(function() {
	$('#left-panel').easytree();
	$(window).click(function(e){ if ($(e.target).closest('.easytree-active').length === 0) $('.easytree-active').removeClass('easytree-active'); }); //deselect active easytree item when you click away
	
	$('.projectFolder').click(function() {
		var folderName = this.id;
		console.log('Clicked folder \'' + folderName + '\'');
	});
	
	Editor.Initialize();
})

var Editor = new function() {
	var c;
	var ctx;
	
	this.Initialize = function() {
		var canvasDiv = $('#center-panel');
		c = document.getElementById('nova-editor');
		ctx = c.getContext('2d');
		c.width = canvasDiv.width();
		c.height = canvasDiv.height();
		
		delete this.Initialize;
	}
	
	this.Context = function() {
		return ctx;
	}
}

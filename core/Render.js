"use strict";

Nova.Render = new function() {
	var c;
	this.SetContext = function(ctx) {
		c = ctx;
	}
	this.Rectangle = function(properties) {
		if(!properties.hasOwnProperty('Position') || !properties.Position.isVector2) return false;
		if(!properties.hasOwnProperty('Size') || !properties.Size.isVector2) return false;
		if(properties.hasOwnProperty('Angle')) var Rotation = Nova.System.toRadians(properties.Angle);
		else var Rotation = 0;
		if(properties.hasOwnProperty('Offset') && properties.Offset.isVector2) var Offset = properties.Offset.Copy();
		else var Offset = new Nova.System.Vector2();

		var drawToGUI = properties.GUI || false;

		if (!isWithinScreen(properties.Position.X, properties.Position.Y, properties.Size.X, properties.Size.Y)) return false;

		c.save();
		if(!drawToGUI) Nova.Viewport.Apply();
		c.translate(properties.Position.X, properties.Position.Y);
		c.rotate(Rotation);
		c.translate(-(properties.Position.X), -(properties.Position.Y));

		c.fillStyle = properties.FillColour || 'red';
		c.strokeStyle = properties.StrokeColour || 'red';
		c.globalAlpha = properties.StrokeAlpha || 1;
		c.strokeRect(properties.Position.X - Offset.X, properties.Position.Y - Offset.Y, properties.Size.X, properties.Size.Y);
		if(properties.Fill) {
			c.globalAlpha = properties.FillAlpha || .3;
			c.fillRect(properties.Position.X - Offset.X, properties.Position.Y - Offset.Y, properties.Size.X, properties.Size.Y);
		}
		c.restore();
	}
	this.Arc = function(properties) {
		if(!properties.hasOwnProperty('Position') || !properties.Position.isVector2) return false;
		if(properties.hasOwnProperty('Offset') && properties.Offset.isVector2) var Offset = properties.Offset.Copy();
		else var Offset = new Nova.System.Vector2();
		var angle = properties.Angle || 0;
		if(!properties.hasOwnProperty('Radius')) return false;
		var drawToGUI = properties.GUI || false;

		if(properties.hasOwnProperty('StartAngle')) var startAngle = Nova.System.toRadians(properties.StartAngle);
		else var startAngle = 0;
		if(properties.hasOwnProperty('EndAngle')) var startAngle = Nova.System.toRadians(properties.EndAngle);
		else var endAngle = 2*Math.PI;
		if(properties.Radius.isVector2) var Radius = properties.Radius.X;
		else var Radius = parseFloat(properties.Radius);

		c.save();
		if(!drawToGUI) Nova.Viewport.Apply();
		c.translate(properties.Position.X, properties.Position.Y);
		c.rotate(angle);
		c.translate(-properties.Position.X, -properties.Position.Y);
		
		c.globalAlpha = properties.StrokeAlpha || 1;
		c.beginPath();
		c.arc(properties.Position.X, properties.Position.Y, Radius, startAngle, endAngle);
		c.strokeStyle = properties.StrokeColour || 'red';
		c.lineWidth = properties.StrokeWidth || 1;
		c.stroke()
		if(properties.Fill) {
			c.fillStyle = properties.FillColour || 'red';
			c.globalAlpha = properties.FillAlpha || .3;
			c.fill();
		}
		c.restore();
	}
	this.Ellipse = function(properties) {
		console.warn('Nova.Render.Ellipse is only supported in Chrome or Opera. Will fallback to Nova.Render.Arc if Nova.System.GetUserAgent() does not match.');
		if(Nova.System.GetUserAgent() != 'Chrome' && Nova.System.GetUserAgent() != 'Opera') {
			this.Arc(properties);
			return false;
		}
		if(!properties.hasOwnProperty('Position') || !properties.Position.isVector2) return false;
		if(!properties.hasOwnProperty('Radius') || !properties.Radius.isVector2) return false;
		var drawToGUI = properties.GUI || false;

		if(properties.hasOwnProperty('StartAngle')) var startAngle = Nova.System.toRadians(properties.StartAngle);
		else var startAngle = 0;
		if(properties.hasOwnProperty('EndAngle')) var startAngle = Nova.System.toRadians(properties.EndAngle);
		else var endAngle = 2*Math.PI;
		if(properties.hasOwnProperty('Rotation')) var Rotation = Nova.System.toRadians(properties.Rotation);
		else var Rotation = 0;

		c.save();
		if(!drawToGUI) Nova.Viewport.Apply();
		c.globalAlpha = properties.StrokeAlpha || 1;
		c.beginPath();
		c.ellipse(properties.Position.X, properties.Position.Y, properties.Radius.X, properties.Radius.Y, Rotation, startAngle, endAngle);
		c.strokeStyle = properties.StrokeColour || 'red';
		c.lineWidth = properties.StrokeWidth || 1;
		c.stroke();
		if(properties.Fill) {
			c.fillStyle = properties.FillColour || 'red';
			c.globalAlpha = properties.FillAlpha || .3;
			c.fill();
		}
		c.restore();
	}
	this.Image = function(properties) {
		if(!properties.hasOwnProperty('Position') || !properties.Position.isVector2) return false;
		if(!properties.hasOwnProperty('Image')) return false;
		var drawToGUI = properties.GUI || false;
		c.globalAlpha = properties.Alpha || 1;
		var imageToDraw = Nova.Loader.GetImage(properties.Image);
		if(imageToDraw == false) return false;
		var Size = new Nova.System.Vector2(imageToDraw.width, imageToDraw.height);
		if(properties.hasOwnProperty('Size') && properties.Size.isVector2) Size = properties.Size;
		if(properties.hasOwnProperty('Width')) Size.X = parseFloat(properties.Width);
		if(properties.hasOwnProperty('Height')) Size.X = parseFloat(properties.Height);

		if (!isWithinScreen(properties.Position.X, properties.Position.Y, Size.X, Size.Y)) return false;

		c.save();
		if(!drawToGUI) Nova.Viewport.Apply();
		c.globalAlpha = properties.Alpha || 1;
		c.drawImage(imageToDraw, 0, 0, imageToDraw.width, imageToDraw.height, properties.Position.X, properties.Position.Y, Size.X, Size.Y);
		c.restore();
	}
	this.Sprite = function(properties) {
		if(!properties.hasOwnProperty('Position') || !properties.Position.isVector2) return false;
		if(properties.hasOwnProperty('Angle')) var Rotation = Nova.System.toRadians(properties.Angle);
		else var Rotation = 0;
		if(!properties.hasOwnProperty('Sprite')) return false;
		if(typeof properties.Sprite === 'string') var Sprite = Nova.Loader.GetSprite(properties.Sprite);
		else if(properties.Sprite.isSprite) var Sprite = properties.Sprite;
		else var Sprite = Nova.Loader.GetSprite(properties.Sprite);
		if(Sprite == false) return false;
		var drawToGUI = properties.GUI || false;

		var Image = Nova.Loader.GetImage(Sprite.image.split(".")[0]);
		var Animation = Sprite.animations[properties.Animation] || Sprite.animations[Object.keys(Sprite.animations)[0]];
		var Frame = Animation[properties.Frame] || Animation[0];
		var Size = new Nova.System.Vector2(Image.width, Image.height);
		if(properties.hasOwnProperty('Size') && properties.Size.isVector2) Size = properties.Size;
		if(properties.hasOwnProperty('Width')) Size.X = parseFloat(properties.Width);
		if(properties.hasOwnProperty('Height')) Size.X = parseFloat(properties.Height);

		if (!isWithinScreen(properties.Position.X, properties.Position.Y, Size.X, Size.Y)) return false;

		c.save();
		if(!drawToGUI) Nova.Viewport.Apply();
		c.translate(properties.Position.X, properties.Position.Y);
		c.rotate(Rotation);
		c.translate(-properties.Position.X, -properties.Position.Y);
		
		c.globalAlpha = properties.Alpha || 1;
		c.drawImage(Image, Frame.x, Frame.y, Frame.width, Frame.height, properties.Position.X, properties.Position.Y, Size.X, Size.Y);
		c.restore();
	}
	this.Line = function(properties) {
		if(!properties.hasOwnProperty('Start') || !properties.Start.isVector2) return false;
		if(!properties.hasOwnProperty('End') || !properties.End.isVector2) return false;
		if(properties.hasOwnProperty('Offset') && properties.Offset.isVector2) var Offset = properties.Offset.Copy();
		else var Offset = new Nova.System.Vector2();
		if(properties.hasOwnProperty('Angle')) var Rotation = Nova.System.toRadians(properties.Angle);
		else var Rotation = 0;
		var drawToGUI = properties.GUI || false;

		c.save();
		if(!drawToGUI) Nova.Viewport.Apply();

		c.strokeStyle = properties.Colour || 'red';
		c.lineWidth = properties.Width || 1;
		c.globalAlpha = properties.Alpha || 1;
		
		c.beginPath();
		c.moveTo(properties.Start.X - Offset.X, properties.Start.Y - Offset.Y);
		c.lineTo(properties.End.X - Offset.X, properties.End.Y - Offset.Y);
		c.stroke();
		c.restore();
	}
	this.Path = function(properties) {
		if(!properties.hasOwnProperty('Path') || !Array.isArray(properties.Path)) return false;
		var drawToGUI = properties.GUI || false;

		c.save();
		if(!drawToGUI) Nova.Viewport.Apply();
		
		c.strokeStyle = properties.StrokeColour || 'red';
		c.strokeWidth = properties.StrokeWidth || 1;
		c.fillStyle = properties.FillColour || 'red';
		
		c.beginPath();
		c.moveTo(properties.Path[0].X, properties.Path[0].Y);
		for(var i = 1; i < properties.Path.length; i++) {
			var currentPoint = properties.Path[i];
			c.lineTo(currentPoint.X, currentPoint.Y);
			if(i == properties.Path.length - 1) {
				if(properties.Complete) c.closePath();
				if(properties.Fill) {
					c.globalAlpha = properties.FillAlpha || .3;
					c.fill();
				}
				c.globalAlpha = properties.StrokeAlpha || 1;
				c.stroke();
			}
		}
		c.restore();
	}
	this.Text = function(properties) {
		if(!properties.hasOwnProperty('Position') || !properties.Position.isVector2) return false;
		if(!properties.hasOwnProperty('Text')) return false;
		var drawToGUI = properties.GUI || false;
		if(properties.hasOwnProperty('Size')) var fontSize = properties.Size.toString();
		else fontSize = '16'
		if(fontSize.substr(fontSize.length - 2) != 'px') fontSize = fontSize.concat('px ');
		var Font = fontSize.concat(properties.Font || 'Comic Sans MS');

		c.save();
		if(!drawToGUI) Nova.Viewport.Apply();
		c.font = Font;
		c.textBaseline = 'top';
		c.fillStyle = properties.Colour || 'red';
		c.fillText(properties.Text.toString(), properties.Position.X, properties.Position.Y);
		c.restore();
	}
	function isWithinScreen(x, y, w, h){
		var Screen = {};
		Screen.Position = Nova.Viewport.GetPositionReal();
		Screen.Size = Nova.Viewport.GetSize();

		var Element = {};
		Element.Position = { X: x, Y: y };
		Element.Size = { X: w, Y: h };

		if (Element.Position.X < Screen.Position.X + Screen.Size.X  && Element.Position.X + Element.Size.X  > Screen.Position.X &&
		Element.Position.Y < Screen.Position.Y + Screen.Size.Y && Element.Position.Y + Element.Size.Y > Screen.Position.Y) {
			return true;
		}
		return false;
	}
}
/* exported Levels */
/* globals settings */
/* --------------------------------- */
"use strict";


var Levels = (function() {
	var colors = [
		"#4caf50", // "green",
		"#ffeb3b", // "yellow",
		"#f57c00", // "orange",
		"#d32f2f", // "red",
		"#f06292", // "pink",
		"#9c27b0", // "purple",
		"#3f51b5", // "blue",
		"#2196f3", // "lightblue",
		"#333333", // "black",
		"#FFFFFF"  // "white"
	];

	var min = 0;
	var max = (colors.length - 1);
	var unlocked;

	var redraw;
	var size;
	var radians;

	var self = {};

	self.init = function() {
		unlocked = 1;
		redraw = true;
		size = settings.size / 2;
		radians = size / 2;
	};

	var drawTile = function(context, i) {
		context.fillStyle = colors[i];
		var x = settings.size * (settings.width + 1) - radians;
		var y = settings.size * settings.height - (i * size + size);

		
		context.beginPath();
		context.arc(x + radians, y + radians, radians, 0, (Math.PI * 2), true);
		context.closePath();
		context.fill();

		var lineWidth = 2;
		context.strokeStyle = "rgba(0, 0, 0, 0.33)";
		context.lineWidth = lineWidth;
		context.beginPath();
		context.arc(x + radians, y + radians, radians - (lineWidth / 2), 0, (Math.PI * 2), true);
		context.stroke();

		if (i == unlocked) {
			context.fillStyle = "rgba(0, 0, 0, 0.5)";
			var arrowSize = radians / 2;
			context.beginPath();
			x = x + size + 3;
			y = y + (size - (arrowSize * 2)) / 2;
			context.moveTo(x + 0, y + arrowSize); // Middle
			context.lineTo(x + arrowSize, y + arrowSize * 2); // Bottom
			context.lineTo(x + arrowSize, y + 0); // Top
			context.fill();
		}
	};


	self.draw = function(context) {
		if (redraw) {
			redraw = false;

			var width = settings.size * 2;
			var height = settings.size * settings.height;
			var x = settings.size * settings.width;
			var y = settings.size * 2;

			context.clearRect(x, y, width, height);
			context.fillStyle = "rgba(255, 255, 255, 0.25)";
			context.fillRect(x, y, width, height);

			for (var i = 0; i < colors.length; i++) {
				context.fillStyle = colors[i];
				drawTile(context, i);
			}
		}
	};

	self.getColor = function(level) {
		return colors[level];
	};

	self.getNext = function(level) {
		var next = (level + 1);
		if (next <= max) {
			if (next < max) {
				// Can't random a max level tile.
				unlocked = Math.max(unlocked, next);
				redraw = true;
			}
			return next;
		} else {
			return null;
		}
	};

	self.getRandom = function() {
		return Math.floor(Math.random() * ((unlocked + 1) - min)) + min;
	};

	return self;
})();

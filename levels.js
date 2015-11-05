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
	var unlocked = 1;
	var size = settings.size / 2;

	var self = {};
	self.getColor = function(level) {
		return colors[level];
	};

	self.getNext = function(level) {
		var next = (level + 1);
		if (next <= max) {
			if (next < max) {
				// Can't random ut a max box.
				unlocked = Math.max(unlocked, next);
			}
			return next;
		} else {
			return null;
		}
	};

	self.getRandom = function() {
		return Math.floor(Math.random() * ((unlocked + 1) - min)) + min;
	};

	self.draw = function(context) {
		for (var i = 0; i < colors.length; i++) {
			context.fillStyle = colors[i];
			var x = 8 * settings.size;
			var y = (settings.height * settings.size) - (i * size + size);

			var radians = size / 2;
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
				context.fillStyle = "rgba(0, 0, 0, 0.75)";
				var arrowSize = radians / 2;
				context.beginPath();
				x = x + size + 3;
				y = y + (size - (arrowSize * 2)) / 2;
				context.moveTo(x + 0, y + arrowSize); // Middle
				context.lineTo(x + arrowSize, y + arrowSize * 2); // Bottom
				context.lineTo(x + arrowSize, y + 0); // Top
				context.fill();
			}
		}
	};

	return self;
})();

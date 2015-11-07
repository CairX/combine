/* exported Score */
/* globals settings */
/* --------------------------------- */
"use strict";


var Score = (function() {
	var width;
	var height;
	var x;
	var y;

	var redraw;
	var total;

	var init = function() {
		width = settings.size * 2;
		height = settings.size * 2;
		x = settings.size * settings.width;
		y = 0;

		redraw = true;
		total = 0;
	};

	var draw = function(context) {
		if (redraw) {
			redraw = false;

			context.clearRect(x, y, width, height);
			context.fillStyle = "rgba(255, 255, 255, 0.25)";
			context.fillRect(x, y, width, height - 1);

			context.lineWidth = 1;
			context.strokeStyle = "rgba(0, 0, 0, 0.25)";
			context.beginPath();
			context.moveTo(x, height - 0.5);
			context.lineTo(x + width, height - 0.5);
			context.stroke();

			context.font = "bold 14px sans-serif";
			context.textAlign = "end";
			context.textBaseline = "middle";
			context.fillStyle = "black";
			context.fillText(total, x + width - 16, y + height / 2, width);
		}
	};

	var add = function(level) {
		total += Math.pow(3, level);
		redraw = true;
	};

	return {
		"init": init,
		"draw": draw,
		"add": add
	};
})();

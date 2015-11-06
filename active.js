/* exported Active */
/* globals Combiner, Levels, settings */
/* --------------------------------- */
"use strict";


/* --------------------------------- */
/* TODO: There has to be better
/* names then one and two.
/* --------------------------------- */
var Active = (function() {
	var one;
	var two;
	var state;

	var redraw;
	var width;
	var height;

	var self = {};
	self.init = function() {
		width = settings.size * settings.width;
		height = settings.size * 2;

		self.new();
	};

	self.new = function() {
		one = new Combiner(Levels.getRandom(), 3, 7);
		two = new Combiner(Levels.getRandom(), 4, 7);
		state = 0;

		redraw = true;
	};

	self.draw = function(context) {
		if (redraw) {
			redraw = false;

			context.clearRect(0, 0, width, height);
			context.fillStyle = "rgba(255, 255, 255, 0.1)";
			context.fillRect(0, 0, width, height - 1); // Don't cover the line

			context.lineWidth = 1;
			context.strokeStyle = "rgba(0, 0, 0, 0.25)";
			context.beginPath();
			context.moveTo(0, height - 0.5);
			context.lineTo(width, height - 0.5);
			context.stroke();

			one.draw(context);
			two.draw(context);
		}
	};

	self.moveLeft = function() {
		if (one.x > 0 && two.x > 0) {
			one.x -= 1;
			two.x -= 1;
		}
		redraw = true;
	};

	self.moveRight = function() {
		if (one.x + 1 < settings.width && two.x + 1 < settings.width) {
			one.x += 1;
			two.x += 1;
		}
		redraw = true;
	};

	self.rotate = function() {
		// TODO: Handle 0x0 rotation.
		switch (state) {
			case 0:
				one.x += 1;
				one.y += 1;
				state = 1;
				break;

			case 1:
				one.y -= 1;
				two.x -= 1;
				state = 2;
				break;

			case 2:
				two.x += 1;
				two.y += 1;
				state = 3;
				break;

			default:
				one.x -= 1;
				two.y -= 1;
				state = 0;
				break;
		}
		redraw = true;
	};

	self.get = function() {
		return [one, two];
	};

	return self;
})();

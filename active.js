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

	var self = {};
	self.draw = function(context) {
		context.lineWidth = 1;
		context.strokeStyle = "rgba(255, 255, 255, 0.25)";
		context.beginPath();
		context.moveTo(0, settings.size * 2  + 0.5);
		context.lineTo(settings.size * settings.width, settings.size * 2 + 0.5);
		context.closePath();
		context.stroke();

		one.draw(context);
		two.draw(context);
	};

	self.new = function() {
		one = new Combiner(Levels.getRandom(), 3, 7);
		two = new Combiner(Levels.getRandom(), 4, 7);
		state = 0;
	};

	self.moveLeft = function() {
		if (one.x > 0 && two.x > 0) {
			one.x -= 1;
			two.x -= 1;
		}
	};

	self.moveRight = function() {
		if (one.x + 1 < settings.width && two.x + 1 < settings.width) {
			one.x += 1;
			two.x += 1;
		}
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
	};

	self.get = function() {
		return [one, two];
	};

	return self;
})();

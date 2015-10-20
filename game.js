/* globals console */

"use strict";

var settings = {
	size: 48,
	width: 7,
	height: 9
};

var colors = ["green", "yellow", "orange", "red", "purple", "blue"];

var getRandom = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
};

var canvas = document.getElementById("canvas");
canvas.width = settings.size * settings.width;
canvas.height = settings.size * settings.height;

var context = canvas.getContext("2d");

function Combiner(color, x, y) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.size = settings.size;

	this.draw = function() {
		context.fillStyle = this.color;
		var x = this.x * this.size;
		var y = (settings.height * this.size) - (this.y * this.size + this.size);
		context.fillRect(x, y, this.size, this.size);
		context.strokeStyle = "black";
		context.strokeRect(x + 0.5, y + 0.5, this.size, this.size);
	};
}

// var combiner = new Combiner("green", 0, 0);
var active = {
	one: new Combiner("green", 3, 7),
	two: new Combiner("yellow", 4, 7),
	state: 0
};
var rotate = function(a) {
	// Handle 0x0 rotation.
	switch (a.state) {
		case 0:
			a.one.x += 1;
			a.one.y += 1;
			a.state = 1;
			break;

		case 1:
			a.one.y -= 1;
			a.two.x -= 1;
			a.state = 2;
			break;

		case 2:
			a.two.x += 1;
			a.two.y += 1;
			a.state = 3;
			break;

		default:
			a.one.x -= 1;
			a.two.y -= 1;
			a.state = 0;
			break;
	}
};
var combiners = [];

var draw = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	active.one.draw();
	active.two.draw();

	for (var i = 0; i < combiners.length; i++) {
		combiners[i].draw();
	}

	window.requestAnimationFrame(draw);
};

// Do combine again if anything has changed.
var combine = function () {
	// Combine
	for (var i = 0; i < combiners.length; i++) {
		var c = combiners[i];
		var matches = getAround(c);
		console.log(matches);
		// var up = getCombiner(c.x, c.y - 1, c.color);
		// var down = getCombiner(c.x, c.y + 1, c.color);
		// var left = getCombiner(c.x - 1, c.y, c.color);
		// var right = getCombiner(c.x + 1, c.y, c.color);
	}

	// Gravity fall
};

var getAround = function(c) {
	var matches = [];

	var up = getCombiner(c.x, c.y - 1, c.color);
	if (up) {
		matches.push(up);
	}
	var down = getCombiner(c.x, c.y + 1, c.color);
	if (down) {
		matches.push(down);
	}
	var left = getCombiner(c.x - 1, c.y, c.color);
	if (left) {
		matches.push(left);
	}
	var right = getCombiner(c.x + 1, c.y, c.color);
	if (right) {
		matches.push(right);
	}

	// var tmp = [];
	// for (var i = 0; i < matches.length; i++) {
	// 	matches = tmp.concat(getAround(matches[i]));
	// }

	// return matches.concat(tmp);
	return matches;
};

var getCombiner = function(x, y, color) {
	for (var i = 0; i < combiners.length; i++) {
		var c = combiners[i];
		if (c.color == color && c.x == x && c.y == y) {
			return c;
		}
	}

	return null;
};

var getRowHeight = function(x) {
	var height = 0;

	for (var i = 0; i < combiners.length; i++) {
		if (combiners[i].x == x) {
			height += 1;
		}
	}
	console.log(height);
	return height;
};
//window.requestAnimationFrame(draw);
draw();

window.addEventListener("keypress", function(e) {
	console.log(e);

	switch (e.key) {
		case "ArrowDown":
			var height = getRowHeight(active.one.x);
			active.one.y = height + (active.one.y - 7);
			combiners.push(active.one);


			if (active.one.x != active.two.x) {
				height = getRowHeight(active.two.x);
			}
			active.two.y = height + (active.two.y - 7);
			combiners.push(active.two);

			if (getRowHeight(active.one.x) <= 7 && getRowHeight(active.two.x) <= 7) {
				
			} else {
				// TODO: Game over
				combiners = [];
			}

			active.one = new Combiner(colors[getRandom(0, colors.length)], 3, 7);
			active.two = new Combiner(colors[getRandom(0, colors.length)], 4, 7);
			active.state = 0;

			combine();

			e.preventDefault();
			break;

		case "ArrowUp":
			rotate(active);
			e.preventDefault();
			break;

		case "ArrowLeft":
			if (active.one.x > 0 && active.two.x > 0) {
				active.one.x -= 1;
				active.two.x -= 1;
			}
			e.preventDefault();
			break;

		case "ArrowRight":
			if (active.one.x + 1 < settings.width && active.two.x + 1 < settings.width) {
				active.one.x += 1;
				active.two.x += 1;
			}
			e.preventDefault();
			break;
	}
});

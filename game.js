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
	};
}

// var combiner = new Combiner("green", 0, 0);
var active = {
	one: new Combiner("green", 3, 7),
	two: new Combiner("yellow", 4, 7),
	state: 0
};
var rotate = function(a) {
	switch (a.state) {
		case 0:
			a.one.x = 4;
			a.one.y = 8;
			a.state = 1;
			break;

		case 1:
			a.one.y = 7;
			a.two.x = 3;
			a.state = 2;
			break;

		case 2:
			// a.one.x = 3;
			a.two.x = 4;
			a.two.y = 8;
			a.state = 3;
			break;

		default:
			a.one.x = 3;
			a.two.y = 7;
			a.state = 0;
			break;
	}
};
var combiners = [];
// combiners.add(combiner);

var draw = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	active.one.draw();
	active.two.draw();
	// combiner.draw();
	// console.log("drawn");
	for (var i = 0; i < combiners.length; i++) {
		combiners[i].draw();
	}

	window.requestAnimationFrame(draw);
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

	// console.log(combiner);
	switch (e.key) {
		case "ArrowDown":
			var height = getRowHeight(active.one.x);

			active.one.y = height;
			combiners.push(active.one);


			height = getRowHeight(active.two.x);
			active.two.y = height;
			combiners.push(active.two);

			if (getRowHeight(active.one.x) <= 7 && getRowHeight(active.two.x) <= 7) {
				
			} else {
				// TODO: Game over
				combiners = [];
			}

			active.one = new Combiner(colors[getRandom(0, colors.length)], 3, 7);
			active.two = new Combiner(colors[getRandom(0, colors.length)], 4, 7);
			active.state = 0;

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
	// console.log(combiner);

	
	// return false;
});

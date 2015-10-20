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
		context.fillRect((this.x * this.size), (this.y * this.size), this.size, this.size);
	};
}

// var combiner = new Combiner("green", 0, 0);
var active = {
	one: new Combiner("green", 3, 0),
	two: new Combiner("yellow", 4, 0)
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
			var heightOne = getRowHeight(active.one.x);
			var heightTwo = getRowHeight(active.two.x);

			var color = colors[getRandom(0, colors.length)];
			if (heightOne < 7 && heightTwo < 7) {
				active.one.y = 8 - heightOne;
				combiners.push(active.one);
				var color = colors[getRandom(0, colors.length)];
				active.one = new Combiner(color, 3, 0);

				active.two.y = 8 - heightTwo;
				combiners.push(active.two);
				color = colors[getRandom(0, colors.length)];
				active.two = new Combiner(color, 4, 0);
			} else {
				// TODO: Game over
			}

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

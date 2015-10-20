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

var combiner = new Combiner("green", 0, 0);
var combiners = [];
// combiners.add(combiner);

var draw = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	combiner.draw();
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
			var height = getRowHeight(combiner.x);
			if (height < 7) {
				combiner.y = 8 - height; // (canvas.height - size) - (combiners.length * size);
				// combiner.y = 32;
				combiners.push(combiner);
				var color = colors[getRandom(0, colors.length)];
				combiner = new Combiner(color, combiner.x, 0);
			} else {
				// TODO: Game over
			}
			e.preventDefault();
			break;

		case "ArrowLeft":
			if (combiner.x > 0) {
				combiner.x -= 1;
			}
			e.preventDefault();
			break;

		case "ArrowRight":
			if (combiner.x + 1 < settings.width) {
				combiner.x += 1;
			}
			e.preventDefault();
			break;
	}
	// console.log(combiner);

	
	// return false;
});

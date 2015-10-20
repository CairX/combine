/* globals console */

"use strict";

var size = 32;

var getRandom = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
};

var canvas = document.getElementById("canvas");
canvas.width = size * 7;
canvas.height = size * 9;

var context = canvas.getContext("2d");


context.fillStyle = "green";
context.fillRect(0, 0, 10, 10);


function Combiner(color, x, y) {
	this.x = x;
	this.y = y;
	this.color = color;

	this.draw = function() {
		context.fillStyle = this.color;
		context.fillRect((this.x * size), (this.y * size), size, size);
	};
}

var colors = ["green", "yellow", "orange", "red", "purple", "blue"];

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
			combiner.y = 8 - getRowHeight(combiner.x); // (canvas.height - size) - (combiners.length * size);
			// combiner.y = 32;
			combiners.push(combiner);
			var color = colors[getRandom(0, colors.length)];
			combiner = new Combiner(color, combiner.x, 0);
			e.preventDefault();
			break;
		case "ArrowLeft":
			combiner.x -= 1;
			e.preventDefault();
			break;
		case "ArrowRight":
			combiner.x += 1;
			e.preventDefault();
			break;
	}
	// console.log(combiner);

	
	// return false;
});

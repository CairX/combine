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
	// TODO: Handle 0x0 rotation.
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

	context.strokeStyle = "blue";
	context.beginPath();
	context.moveTo(0, settings.size * 2  + 0.5);
	context.lineTo(settings.size * settings.width, settings.size * 2 + 0.5);
	context.closePath();
	context.stroke();

	window.requestAnimationFrame(draw);
};

// Do combine again if anything has changed.
var combine = function () {
	var god = [];
	var todo = [];

	// Combine
	for (var i = 0; i < combiners.length; i++) {
		var c = combiners[i];
		// var matches = getAround(c);
		var matches = getPath(c);

		var godContains = (god.indexOf(matches[0]) >= 0);

		// for (var m = 0; m < matches.length; m++) {
		// }


		// console.log(matches);
		if (!godContains && matches.length >= 3 && matches.indexOf(matches) == -1) {
			console.log(matches);
			todo.push(matches);
			god = god.concat(matches);
		}
		// console.log("--- ---");
		// var up = getCombiner(c.x, c.y - 1, c.color);
		// var down = getCombiner(c.x, c.y + 1, c.color);
		// var left = getCombiner(c.x - 1, c.y, c.color);
		// var right = getCombiner(c.x + 1, c.y, c.color);
	}
	// console.log("--- --- ---");
	console.log(todo);
	console.log(god);
	console.log("--- --- --- ---");

	for (var t = 0; t < todo.length; t++) {
		var td = todo[0];

		// Find the combiner that is the smallest.
		// As in first be the lowest value on y.
		var base = td[0];
		for (var ci = 1; ci < td.length; ci++) {
			var cd = td[ci];
			if (cd.y <= base.y) {
				base = cd;
			}
		}
		// And then lowest with x.
		for (var cx = 1; cx < td.length; cx++) {
			var cdx = td[cx];
			if (cdx.y == base.y && cdx.x < base.x) {
				base = cdx;
			}
		}

		for (var cii = 0; cii < td.length; cii++) {
			var cdd = td[cii];
			var indx = combiners.indexOf(cdd);
			if (indx >= 0) {
				combiners.splice(indx, 1);
			}
		}

		console.log(base);
		var newLevel = colors.indexOf(base.color) + 1;
		// If he combination was on the last level we don't
		// make a replacement instead simply remove it.
		// This keeps the game going.
		if (newLevel < colors.length) {
			var newColor = colors[newLevel];
			var newCombiner = new Combiner(newColor, base.x, base.y);
			console.log(newCombiner);
			combiners.push(newCombiner);
		}
	}

	// TODO: Gravity fall
	for (var ciii = 0; ciii < settings.width; ciii++) {
		var column = getColumn(ciii);
		// console.log(column);
		column.sort(function(a, b) {
			return a.y - b.y;
		});
		// console.log(column);

		for (var y = 0; y < column.length; y++) {
			column[y].y = y;
		}
	}

	return (todo.length > 0);
};

var getColumn = function(x) {
	var column = [];
	for (var i = 0; i < combiners.length; i++) {
		if (combiners[i].x == x) {
			column.push(combiners[i]);
		}
	}
	return column;
};

var getPath = function(c) {

	var path = [c];
	var handled = [];
	var nothandled = [c];

	while (nothandled.length > 0) {
		var n = nothandled.shift();
		handled.push(n);

		var around = getAround(n);
		for (var i = 0; i < around.length; i++) {
			var a = around[i];
			// console.log(a);
			// console.log("handled: " + handled.indexOf(a));
			if (handled.indexOf(a) == -1) {
				nothandled.push(a);
			}
		}
	}

	return handled;
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
	// console.log(height);
	return height;
};
//window.requestAnimationFrame(draw);
draw();

window.addEventListener("keypress", function(e) {
	// console.log(e);

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

			var changed = true;
			while (changed) {
				changed = combine();
			}

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

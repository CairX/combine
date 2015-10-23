/* globals console */

"use strict";

var settings = {
	size: 48,
	width: 7,
	height: 9
};


/* --------------------------------- */
/* Main game loop container.
/* --------------------------------- */
var Game = (function() {
	var canvas;
	var context;
	var items = [];

	var self = {};
	self.draw = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < items.length; i++) {
			items[i].draw(context);
		}

		context.strokeStyle = "blue";
		context.beginPath();
		context.moveTo(0, settings.size * 2  + 0.5);
		context.lineTo(settings.size * settings.width, settings.size * 2 + 0.5);
		context.closePath();
		context.stroke();

		window.requestAnimationFrame(self.draw);
	};

	self.init = function() {
		canvas = document.getElementById("canvas");
		canvas.width = settings.size * settings.width;
		canvas.height = settings.size * settings.height;
		context = canvas.getContext("2d");

		self.draw();
	};

	self.add = function(item) {
		items.push(item);
	};

	return self;
})();

/* --------------------------------- */
/* Levels
/* --------------------------------- */
var Levels = (function() {
	var colors = [
		"green",
		"yellow",
		"orange",
		"red",
		"pink",
		"purple",
		"blue",
		"lightblue",
		"black",
		"white"
	];
	var min = 0;
	var max = (colors.length - 1);
	var unlocked = 1;

	var self = {};
	self.getColor = function(level) {
		return colors[level];
	};

	self.getNext = function(level) {
		var next = (level + 1);
		if (next <= max) {
			unlocked = Math.max(unlocked, next);
			return next;
		} else {
			return null;
		}
	};

	self.getRandom = function() {
		return Math.floor(Math.random() * ((unlocked + 1) - min)) + min;
	};

	return self;
})();


/* --------------------------------- */
/* Combiner
/* --------------------------------- */
function Combiner(level, x, y) {
	this.x = x;
	this.y = y;
	this.level = level;
	this.size = settings.size;

	this.draw = function(context) {
		context.fillStyle = Levels.getColor(this.level);
		var x = this.x * this.size;
		var y = (settings.height * this.size) - (this.y * this.size + this.size);
		context.fillRect(x, y, this.size, this.size);
		context.strokeStyle = "black";
		context.strokeRect(x + 0.5, y + 0.5, this.size, this.size);
	};
}


/* --------------------------------- */
/* Active
/* --------------------------------- */
var Active = (function() {
	// TODO: There has to be better
	// names then one and two.
	var one;
	var two;
	var state;

	var self = {};
	self.draw = function(context) {
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
Active.new();
Game.add(Active);


var Board = (function() {
	var combiners = [];
	var self = {};

	// Do combine again if anything has changed.
	// TODO: Somewhere there is broken combinations
	// happening, just a bit tricky to follow with
	// the instant changes taking place.
	self.combine = function () {
		var god = [];
		var todo = [];

		// Combine
		for (var i = 0; i < combiners.length; i++) {
			var c = combiners[i];
			var matches = getPath(c);
			var godContains = (god.indexOf(matches[0]) >= 0);

			if (!godContains && matches.length >= 3 && matches.indexOf(matches) == -1) {
				console.log(matches);
				todo.push(matches);
				god = god.concat(matches);
			}
		}

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

			// Remove the old combiners.
			for (var cii = 0; cii < td.length; cii++) {
				var cdd = td[cii];
				var indx = combiners.indexOf(cdd);
				if (indx >= 0) {
					combiners.splice(indx, 1);
				}
			}

			// If he combination was on the last level we don't
			// make a replacement instead simply remove it.
			// This keeps the game going.
			var newLevel = Levels.getNext(base.level);
			if (newLevel) {
				var newCombiner = new Combiner(newLevel, base.x, base.y);
				combiners.push(newCombiner);
			}
		}

		// Gravity fall
		for (var ciii = 0; ciii < settings.width; ciii++) {
			var column = getColumn(ciii);
			column.sort(function(a, b) {
				return a.y - b.y;
			});

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
		var handled = [];
		var nothandled = [c];

		while (nothandled.length > 0) {
			var n = nothandled.shift();
			handled.push(n);

			var around = getAround(n);
			for (var i = 0; i < around.length; i++) {
				var a = around[i];
				if (handled.indexOf(a) == -1) {
					nothandled.push(a);
				}
			}
		}

		return handled;
	};

	var getAround = function(c) {
		var matches = [];

		var up = getCombiner(c.x, c.y - 1, c.level);
		if (up) {
			matches.push(up);
		}
		var down = getCombiner(c.x, c.y + 1, c.level);
		if (down) {
			matches.push(down);
		}
		var left = getCombiner(c.x - 1, c.y, c.level);
		if (left) {
			matches.push(left);
		}
		var right = getCombiner(c.x + 1, c.y, c.level);
		if (right) {
			matches.push(right);
		}

		return matches;
	};

	var getCombiner = function(x, y, level) {
		for (var i = 0; i < combiners.length; i++) {
			var c = combiners[i];
			if (c.level == level && c.x == x && c.y == y) {
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

		return height;
	};

	self.add = function(cs) {
		var one = cs[0];
		var two = cs[1];

		var height = getRowHeight(one.x);
		one.y = height + (one.y - 7);
		combiners.push(one);


		if (one.x != two.x) {
			height = getRowHeight(two.x);
		}
		two.y = height + (two.y - 7);
		combiners.push(two);
	};

	self.state = function() {
		var gameOver = false;

		for (var x = 0; x < combiners.length; x++) {
			if (getRowHeight(x) > 7) {
				gameOver = true;
				break;
			}
		}
		if (gameOver) {
			// TODO: Game over
			combiners = [];
		}
	};

	self.draw = function(context) {
		for (var i = 0; i < combiners.length; i++) {
			combiners[i].draw(context);
		}
	};

	return self;
})();
Game.add(Board);


/* --------------------------------- */
/* Keys
/* --------------------------------- */
window.addEventListener("keypress", function(e) {
	// console.log(e);

	switch (e.key) {
		case "ArrowDown":
			Board.add(Active.get());
			Active.new();

			var changed = true;
			while (changed) {
				changed = Board.combine();
			}

			Board.state();

			e.preventDefault();
			break;

		case "ArrowUp":
			Active.rotate();
			e.preventDefault();
			break;

		case "ArrowLeft":
			Active.moveLeft();
			e.preventDefault();
			break;

		case "ArrowRight":
			Active.moveRight();
			e.preventDefault();
			break;
	}
});
Game.init();

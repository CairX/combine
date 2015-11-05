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

		context.lineWidth = 1;
		context.strokeStyle = "rgba(255, 255, 255, 0.25)";
		context.beginPath();
		context.moveTo(0, settings.size * 2  + 0.5);
		context.lineTo(settings.size * settings.width, settings.size * 2 + 0.5);
		context.closePath();
		context.stroke();

		for (var i = 0; i < items.length; i++) {
			items[i].draw(context);
		}

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
		"#4caf50", // "green",
		"#ffeb3b", // "yellow",
		"#f57c00", // "orange",
		"#d32f2f", // "red",
		"#f06292", // "pink",
		"#9c27b0", // "purple",
		"#3f51b5", // "blue",
		"#2196f3", // "lightblue",
		"#000000", // "black",
		"#FFFFFF"  // "white"
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
			if (next < max) {
				// Can't random ut a max box.
				unlocked = Math.max(unlocked, next);
			}
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

		var radians = this.size / 2;
		context.beginPath();
		context.arc(x + radians, y + radians, radians, 0, (Math.PI * 2), true);
		context.closePath();
		context.fill();

		var lineWidth = 4;
		context.strokeStyle = "rgba(0, 0, 0, 0.33)";
		context.lineWidth = lineWidth;
		context.beginPath();
		context.arc(x + radians, y + radians, radians - (lineWidth / 2), 0, (Math.PI * 2), true);
		context.stroke();
	};
}

var CombinerSort = function(a, b) {
	if (a.x > b.x || a.y > b.y) { return 1; }
	if (a.x < b.x || a.y < b.y) { return -1; }
	return 0;
};


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
	var columns = [[], [], [], [], [], [], []];
	var self = {};

	self.combine = function () {
		var paths = getPaths();

		// Combine the paths into one.
		combinePaths(paths);

		// Gravity fall
		gravity();

		return (paths.length > 0);
	};

	var getPaths = function() {
		var paths = [];
		var pathsGod = [];

		// Finding the paths to combine.
		for (var column = 0; column < columns.length; column++) {
			for (var row = 0; row < columns[column].length; row++) {
				var combiner = columns[column][row];

				if (pathsGod.indexOf(combiner) == -1) {
					var path = getPath(combiner);

					if (path.length >= 3) {
						paths.push(path);
					}

					pathsGod = pathsGod.concat(path);
				}
			}
		}

		return paths;
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

		var up = getCombiner(c.level, c.x, c.y - 1);
		if (up) {
			matches.push(up);
		}
		var down = getCombiner(c.level, c.x, c.y + 1);
		if (down) {
			matches.push(down);
		}
		var left = getCombiner(c.level, c.x - 1, c.y);
		if (left) {
			matches.push(left);
		}
		var right = getCombiner(c.level, c.x + 1, c.y);
		if (right) {
			matches.push(right);
		}

		return matches;
	};

	var getCombiner = function(level, x, y) {
		// TODO: Store that 7 somewhere.
		if (x < 0 || x >= 7) { return null; }
		if (y < 0 || y >= 7) { return null; }

		var rows = columns[x];
		if (y >= rows.length) { return null; }

		var combiner = rows[y];
		if (combiner.level != level) { return null; }

		return combiner;
	};

	var getColumnHeight = function(column) {
		return columns[column].length;
	};

	var combinePaths = function(paths) {
		// Combine the paths into one.
		for (var p = 0; p < paths.length; p++) {
			var path = paths[p];
			path.sort(CombinerSort);

			var base = path.shift();
			// Replace old with new.
			var newLevel = Levels.getNext(base.level);
			if (newLevel) {
				var newCombiner = new Combiner(newLevel, base.x, base.y);
				columns[newCombiner.x][newCombiner.y] = newCombiner;
			} else {
				columns[base.x].splice(columns[base.x].indexOf(base), 1);
			}

			// Remove the old combiners.
			for (var pi = 0; pi < path.length; pi++) {
				var pc = path[pi];
				columns[pc.x].splice(columns[pc.x].indexOf(pc), 1);
			}
		}
	};

	var gravity = function() {
		// Gravity fall
		for (var column = 0; column < columns.length; column++) {
			var combiners = columns[column];
			combiners.sort(function(a, b) {
				return a.y - b.y;
			});

			for (var y = 0; y < combiners.length; y++) {
				combiners[y].y = y;
			}
		}
	};

	self.push = function(combiner) {
		// Make sure that the combiner
		// is within the board.
		var x = combiner.x;
		x = x < 0 ? 0 : x;
		x = x < 7 ? x : 6;
		combiner.x = x;

		// Gravity fall into the column.
		var height = getColumnHeight(x);
		combiner.y = height;

		// TODO: Fix y too.
		columns[combiner.x][combiner.y] = combiner;
	};

	self.state = function() {
		var gameOver = false;

		for (var column = 0; column < columns.length; column++) {
			if (getColumnHeight(column) > 7) {
				gameOver = true;
				break;
			}
		}
		if (gameOver) {
			// TODO: Game over
			self.reset();
		}
	};

	self.reset = function() {
		// TODO: Store that 7 somewhere.
		for (var column = 0; column <= 7; column++) {
			columns[column] = [];
		}
	};

	self.draw = function(context) {
		for (var column = 0; column < columns.length; column++) {
			for (var row = 0; row < columns[column].length; row++) {
				columns[column][row].draw(context);
			}
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
			var combiner = Active.get();
			combiner.sort(CombinerSort);

			for (var i = 0; i < combiner.length; i ++) {
				Board.push(combiner[i]);
			}
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

/* exported Board */
/* globals Combiner, CombinerSort, Levels, Score, settings */
/* --------------------------------- */
"use strict";


var Board = (function() {
	var columns;
	var redraw;
	var self = {};

	self.init = function() {
		columns = [];

		// TODO: Store that 7 somewhere.
		for (var column = 0; column < 7; column++) {
			columns[column] = [];
		}

		redraw = true;
	};

	self.draw = function(context) {
		if (redraw) {
			var width = settings.size * settings.width;
			var height = settings.size * (settings.height - 2);
			var x = 0;
			var y = settings.size * 2;

			context.clearRect(x, y, width, height);

			context.fillStyle = "rgba(255, 255, 255, 0.5)";
			context.fillRect(x, y, width, height);

			for (var column = 0; column < columns.length; column++) {
				for (var row = 0; row < columns[column].length; row++) {
					columns[column][row].draw(context);
				}
			}
		}
	};

	self.combine = function () {
		var paths = getPaths();

		// Combine the paths into one.
		combinePaths(paths);

		// Gravity fall
		gravity();

		redraw = true;

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

			Score.add(base.level);

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

		redraw = true;
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
			self.init();
			Score.init();
			Levels.init();
		}
	};

	return self;
})();

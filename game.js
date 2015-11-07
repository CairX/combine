/* globals Active, Board, Levels, Score, settings */
/* --------------------------------- */
"use strict";


/* --------------------------------- */
/* Main game loop container.
/* --------------------------------- */
var Game = (function() {
	var canvas;
	var context;
	var items = [];

	var self = {};
	self.draw = function() {
		for (var i = 0; i < items.length; i++) {
			items[i].draw(context);
		}

		window.requestAnimationFrame(self.draw);
	};

	self.init = function() {
		canvas = document.getElementById("canvas");
		canvas.width = settings.size * (settings.width + 2);
		canvas.height = settings.size * settings.height;
		context = canvas.getContext("2d");

		for (var i = 0; i < items.length; i++) {
			items[i].init();
		}

		self.draw();
	};

	self.add = function(item) {
		items.push(item);
	};

	return self;
})();


/* --------------------------------- */
/* Add modules to the game.
/* --------------------------------- */
Game.add(Levels);
Game.add(Score);
Game.add(Active);
Game.add(Board);


/* --------------------------------- */
/* Start the game.
/* --------------------------------- */
Game.init();

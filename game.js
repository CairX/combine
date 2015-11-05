/* globals Active, Board, Levels, settings */
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
		context.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < items.length; i++) {
			items[i].draw(context);
		}

		window.requestAnimationFrame(self.draw);
	};

	self.init = function() {
		canvas = document.getElementById("canvas");
		canvas.width = settings.size * settings.width + 100;
		canvas.height = settings.size * settings.height;
		context = canvas.getContext("2d");

		self.draw();
	};

	self.add = function(item) {
		items.push(item);
	};

	return self;
})();


Game.add(Levels);
Active.new();
Game.add(Active);
Game.add(Board);

Game.init();

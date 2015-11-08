/* exported Sprite */
/* --------------------------------- */
"use strict";


function Sprite(width, height, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;

	this.start = {
		x: this.x,
		y: this.y,
	};

	this.end = {
		x: this.x + this.width,
		y: this.y + this.height,
	};

	this.center = {
		x: (this.x + this.width) / 2,
		y: (this.y + this.height) / 2,
	};
}

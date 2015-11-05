/* exported Combiner, CombinerSort */
/* globals Levels, settings */
/* --------------------------------- */
"use strict";


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

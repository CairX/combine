/* globals Active, Board, CombinerSort */
/* --------------------------------- */
"use strict";


/* --------------------------------- */
/* Keyppress
/* --------------------------------- */
window.addEventListener("keyup", function(e) {
	// console.log(e);

	switch (e.keyCode) {
		case 40: // ArrowDown
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

		case 38: // ArrowUp
			Active.rotate();
			e.preventDefault();
			break;

		case 37: // ArrowLeft
			Active.moveLeft();
			e.preventDefault();
			break;

		case 39: // ArrowRight
			Active.moveRight();
			e.preventDefault();
			break;
	}
});

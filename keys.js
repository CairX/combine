/* globals Active, Board, CombinerSort */
/* --------------------------------- */
"use strict";


/* --------------------------------- */
/* Keyppress
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

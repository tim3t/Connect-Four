/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	for (let y = 0; y < HEIGHT; y++) {
		board.push(Array.from({ length: WIDTH }));
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	const board = document.getElementById('board');

	// Handles clicks at top of the Connect Four Board...it's listening to the top row to add a piece to the correct column:
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	board.append(top);

	// Creates the cells for the main board by listening to height and width variables:
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		board.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	const coin = document.createElement('div');
	coin.classList.add('piece');
	coin.classList.add(`p${currPlayer}`);
	coin.style.top = -50 * (y + 2);

	const spot = document.getElementById(`${y}-${x}`);
	spot.append(coin);
}

/** endGame: announce game end */

function endGame(msg) {
	alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	const x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	if (board.every((row) => row.every((cell) => cell))) {
		return endGame('Tie game!');
	}

	// switch players
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			(
				[
					y,
					x
				]
			) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
		);
	}

	// TODO: read and understand this code. Add comments to help you.
	// Horiz loops over the board checking for a fillex 'x' space plus 1, 2, and 3 pieces to the right.
	// Vert does the same thing, but checking for a 'y' space plus 1, 2, and 3 pieces above
	// DiagDR looks to the right, going up one and over one space each time (from the original coin)
	// DiagDL looks to the left, going up one and left one space each time (from the original coin)

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [
				[
					y,
					x
				],
				[
					y,
					x + 1
				],
				[
					y,
					x + 2
				],
				[
					y,
					x + 3
				]
			];
			let vert = [
				[
					y,
					x
				],
				[
					y + 1,
					x
				],
				[
					y + 2,
					x
				],
				[
					y + 3,
					x
				]
			];
			let diagDR = [
				[
					y,
					x
				],
				[
					y + 1,
					x + 1
				],
				[
					y + 2,
					x + 2
				],
				[
					y + 3,
					x + 3
				]
			];
			let diagDL = [
				[
					y,
					x
				],
				[
					y + 1,
					x - 1
				],
				[
					y + 2,
					x - 2
				],
				[
					y + 3,
					x - 3
				]
			];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();

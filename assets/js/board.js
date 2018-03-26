class playerBoard {

    constructor() {
        this._board = new Float32Array(48);
        this._gameBoard = new Float32Array(48);
        this._winner = 0;
    }

    // Adds to a column by checking the main board
    // Returns the row height for newly added token
    add(column) {
        var row = column * 7 - 2;
        if (this._gameBoard[row] == 1) {
            return -1;
        }
        var counter = row - 1;
        while (counter != row - 6) {
            if (this._gameBoard[counter] == 1) {
                this._gameBoard.set([1], counter + 1);
                this._board.set([1], counter + 1);
                return counter + 2;
            }
            counter -= 1;
        }
        // this._gameBoard[counter + 1] == 1;
        // this._board[counter + 1] == 1;
        this._gameBoard.set([1], counter + 1);
        this._board.set([1], counter + 1);
        //console.log(this._gameBoard);
        return counter + 2;
    }

    // Check if board contains a winning pattern
    // ie. Four in a Four
    // Algorithm is inspired by John Tromp's Fhourstone Benchmark.
    // Uses a bitboard data structures to preform bitwise shifts to
    // check for four-in-a-row patterns.
    // Each case will check if a four-in-a-row pattern exists by
    // preforming a series of shifts, and preforming bitwise ANDs
    // such that each of the 4 bits is required to be true, in order
    // for the resulting bitarray to be true.
    // Due to javascript's shift operator's limitations, the shift and
    // AND operations will be preformed in an alternative way.
    // NOTE: Pseudocode is provided each case as an example.
    isWinner() {
        // Case 1: Vertical
        // var vertical_1 = this._board & (this._board >> 1);
        // if (vertical_1 & (vertical_1 >> 2)) {
        //     this._winner = true;
        // }
        var vertical_1 = new Float32Array(48);
        vertical_1.set(this._board.slice(0, 47), 1);
        var vertical_2 = new Float32Array(48);
        for (var i = 0; i < 49; i++) {
            if (vertical_1[i] == 1 && this._board[i] == 1) {
                vertical_2.set([1], i);
            }
        }
        var vertical_3 = new Float32Array(48);
        vertical_3.set(vertical_2.slice(0, 46), 2);
        for (var i = 0; i < 48; i++) {
            if (vertical_2[i] == 1 && vertical_3[i] == 1) {
                this._winner = true;
            }
        }

        // Case 2: Horizontal
        // var horizontal = this._board & (this._board >> 1*7);
        // if (horizontal & (horizontal >> 2*7)) {
        //     this._winner = true;
        // }
        var horizontal_1 = new Float32Array(48);
        horizontal_1.set(this._board.slice(0, 41), 7);
        var horizontal_2 = new Float32Array(48);
        for (var i = 0; i < 49; i++) {
            if (horizontal_1[i] == 1 && this._board[i] == 1) {
                horizontal_2.set([1], i);
            }
        }
        var horizontal_3 = new Float32Array(48);
        horizontal_3.set(horizontal_2.slice(0, 34), 14);
        for (var i = 0; i < 48; i++) {
            if (horizontal_2[i] == 1 && horizontal_3[i] == 1) {
                this._winner = true;
            }
        }

        // Case 3: Diagonal
        // var diagonal_1 = this._board & (this._board >> 1*6);
        // if (diagonal_1 & (diagonal_1 >> 2*6)) {
        //     this._winner = true;
        // }
        var diagonal_1_1 = new Float32Array(48);
        diagonal_1_1.set(this._board.slice(0, 42), 6);
        var diagonal_1_2 = new Float32Array(48);
        for (var i = 0; i < 49; i++) {
            if (diagonal_1_1[i] == 1 && this._board[i] == 1) {
                diagonal_1_2.set([1], i);
            }
        }
        var diagonal_1_3 = new Float32Array(48);
        diagonal_1_3.set(diagonal_1_2.slice(0, 36), 12);
        for (var i = 0; i < 48; i++) {
            if (diagonal_1_2[i] == 1 && diagonal_1_3[i] == 1) {
                this._winner = true;
            }
        }

        // Case 4: Diagonal
        // var diagonal_2 = this._board & (this._board >> 1*8);
        // if (diagonal_2 & (diagonal_2 >> 2*8)) {
        //     this._winner = true;
        // }
        var diagonal_2_1 = new Float32Array(48);
        diagonal_2_1.set(this._board.slice(0, 40), 8);
        var diagonal_2_2 = new Float32Array(48);
        for (var i = 0; i < 49; i++) {
            if (diagonal_2_1[i] == 1 && this._board[i] == 1) {
                diagonal_2_2.set([1], i);
            }
        }
        var diagonal_2_3 = new Float32Array(48);
        diagonal_2_3.set(diagonal_2_2.slice(0, 32), 16);
        for (var i = 0; i < 48; i++) {
            if (diagonal_2_2[i] == 1 && diagonal_2_3[i] == 1) {
                this._winner = true;
            }
        }
    }

}

module.exports = playerBoard;

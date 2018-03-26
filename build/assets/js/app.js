(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var playerBoard = require('./board.js')
//import {playerBoard} from './board.js';

// Constants
var GAME_X = 512;
var GAME_Y = 512;

// Create a Pixi renderer and stage and add to DOM
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(700,588, {
    transparent: true,
    resolution: 1
});
document.getElementById('board').appendChild(renderer.view);

// Load coin image/sprite and load the setup function
PIXI.loader.add('coin_1', 'assets/images/coin.png').add('coin_2', 'assets/images/yen.png').load(setup);

// Declare global vars. Includes coin sprite objects and graphics objects.
var coin,
  coin_1,
  coin_2,
  turn=1,
  column_1,
  column_2,
  column_3,
  column_4,
  column_5,
  column_6,
  column_7,
  board_1,
  board_2,
  title_1,
  title_2,
  title_3,
  instructions,
  instructions_1,
  instructions_2,
  instructions_3,
  win=false,
  endCoin=false,
  endingCoin;
 var coinArray = new Array();

function setup() {
    stage.interactive = true;

    coin_1 = new PIXI.Sprite(PIXI.loader.resources["coin_1"].texture);
    coin_2 = new PIXI.Sprite(PIXI.loader.resources["coin_2"].texture);

    createCoin(coin_1);
    createCoin(coin_2);

    // Set position of sprite
    coin_1.x = 10;
    coin_1.y = 10;

    // Set position of sprite
    coin_2.x = -50;
    coin_2.y = 10;

    stage.addChild(coin_1);
    stage.addChild(coin_2);

    generateBoard();

    // Create playerBoard objects
    board_1 = new playerBoard();
    board_2 = new playerBoard();

    createEvents();

    connectLoop();
}

// Draw the Connect-Four board with Pixi Graphics
function generateBoard() {
    // Create Graphics object
    var line = new PIXI.Graphics();
    // Draw:
    for (var i = 0; i < 8; i++) {
        line.beginFill(0xaebaba);
        line.drawRect(i*74, 84, 10, 454);
        line.endFill();
    }
    line.beginFill(0xaebaba);
    line.drawRect(0, 84, 528, 10);
    line.endFill();
    for (var i = 1; i < 7; i++) {
        line.beginFill(0xaebaba);
        line.drawRect(0, 84+i*74, 528, 10);
        line.endFill();
    }
    stage.addChild(line);

    column_1 = new PIXI.Text('one', {fontFamily: 'Arial', fontSize: 32, fill: 0xaebaba});
    column_1.x = 10;
    column_1.y = 540;
    column_1.interactive = true;
    column_1.buttonMode = true;
    column_2 = new PIXI.Text('two', {fontFamily: 'Arial', fontSize: 32, fill: 0xaebaba});
    column_2.x = 84;
    column_2.y = 540;
    column_2.interactive = true;
    column_2.buttonMode = true;
    column_3 = new PIXI.Text('three', {fontFamily: 'Arial', fontSize: 32, fill: 0xaebaba});
    column_3.x = 152;
    column_3.y = 540;
    column_3.interactive = true;
    column_3.buttonMode = true;
    column_4 = new PIXI.Text('four', {fontFamily: 'Arial', fontSize: 32, fill: 0xaebaba});
    column_4.x = 238;
    column_4.y = 540;
    column_4.interactive = true;
    column_4.buttonMode = true;
    column_5 = new PIXI.Text('five', {fontFamily: 'Arial', fontSize: 32, fill: 0xaebaba});
    column_5.x = 312;
    column_5.y = 540;
    column_5.interactive = true;
    column_5.buttonMode = true;
    column_6 = new PIXI.Text('six', {fontFamily: 'Arial', fontSize: 32, fill: 0xaebaba});
    column_6.x = 385;
    column_6.y = 540;
    column_6.interactive = true;
    column_6.buttonMode = true;
    column_7 = new PIXI.Text('seven', {fontFamily: 'Arial', fontSize: 30, fill: 0xaebaba});
    column_7.x = 445;
    column_7.y = 540;
    column_7.interactive = true;
    column_7.buttonMode = true;

    title_1 = new PIXI.Text('Connect', {fontFamily: 'Arial', fontSize: 40, fill: 0xaebaba});
    title_1.x = 540;
    title_1.y = 90;
    stage.addChild(title_1);
    title_2 = new PIXI.Text('4', {fontFamily: 'Arial', fontSize: 100, fill: 0xf7dc6f });
    title_2.x = 585;
    title_2.y = 130;
    stage.addChild(title_2);
    title_3 = new PIXI.Text('by Jaehyun Chung', {fontFamily: 'Arial', fontSize: 18, fill: 0xaebaba });
    title_3.x = 540;
    title_3.y = 250;
    stage.addChild(title_3);
    instructions = new PIXI.Text('Instructions:', {fontFamily: 'Arial', fontSize: 18, fill: 0xaebaba });
    instructions.x = 540;
    instructions.y = 430;
    stage.addChild(instructions);
    instructions_1 = new PIXI.Text('Click a number in', {fontFamily: 'Arial', fontSize: 18, fill: 0xaebaba });
    instructions_1.x = 540;
    instructions_1.y = 460;
    stage.addChild(instructions_1);
    instructions_2 = new PIXI.Text('the bottom row, to', {fontFamily: 'Arial', fontSize: 18, fill: 0xaebaba });
    instructions_2.x = 540;
    instructions_2.y = 480;
    stage.addChild(instructions_2);
    instructions_3 = new PIXI.Text('drop a coin!', {fontFamily: 'Arial', fontSize: 18, fill: 0xaebaba });
    instructions_3.x = 540;
    instructions_3.y = 500;
    stage.addChild(instructions_3);

    stage.addChild(column_1);
    stage.addChild(column_2);
    stage.addChild(column_3);
    stage.addChild(column_4);
    stage.addChild(column_5);
    stage.addChild(column_6);
    stage.addChild(column_7);
}

function createCoin(coin) {
    coin.interactive = true;
    // Set size of sprite
    coin.scale.set(0.5, 0.5);
    coin.anchor.set(0.5, 0);
}

// Event handlers for each newly placed coin.
function createEvents() {
    column_1.on('mousedown', function(e) {
        play: if (turn == 1) {
            if (win == true) {break play;}
            coin = placeCoin1(1);
            if (coin == null) {break play;}
            coin.x = 42;
            stage.addChild(coin);
        } else {
            if (win == true) {break play;}
            coin = placeCoin2(1);
            if (coin == null) {break play;}
            coin.x = 42;
            stage.addChild(coin);
        }
        board_1.isWinner();
        board_2.isWinner();
        if ((board_1._winner == true || board_2._winner == true) && win == false) {
            win = true;
            end();
        }
    });
    column_2.on('mousedown', function(e) {
        play: if (turn == 1) {
            if (win == true) {break play;}
            coin = placeCoin1(2);
            if (coin == null) {break play;}
            coin.x = 116;
            stage.addChild(coin);
        } else {
            if (win == true) {break play;}
            coin = placeCoin2(2);
            if (coin == null) {break play;}
            coin.x = 116;
            stage.addChild(coin);
        }
        board_1.isWinner();
        board_2.isWinner();
        if ((board_1._winner == true || board_2._winner == true) && win == false) {
            win = true;
            end();
        }
    });
    column_3.on('mousedown', function(e) {
        play: if (turn == 1) {
            if (win == true) {break play;}
            coin = placeCoin1(3);
            if (coin == null) {break play;}
            coin.x = 190;
            stage.addChild(coin);
        } else {
            if (win == true) {break play;}
            coin = placeCoin2(3);
            if (coin == null) {break play;}
            coin.x = 190;
            stage.addChild(coin);
        }
        board_1.isWinner();
        board_2.isWinner();
        if ((board_1._winner == true || board_2._winner == true) && win == false) {
            win = true;
            end();
        }
    });
    column_4.on('mousedown', function(e) {
        play: if (turn == 1) {
            if (win == true) {break play;}
            coin = placeCoin1(4);
            if (coin == null) {break play;}
            coin.x = 264;
            stage.addChild(coin);
        } else {
            if (win == true) {break play;}
            coin = placeCoin2(4);
            if (coin == null) {break play;}
            coin.x = 264;
            stage.addChild(coin);
        }
        board_1.isWinner();
        board_2.isWinner();
        if ((board_1._winner == true || board_2._winner == true) && win == false) {
            win = true;
            end();
        }
    });
    column_5.on('mousedown', function(e) {
        play: if (turn == 1) {
            if (win == true) {break play;}
            coin = placeCoin1(5);
            if (coin == null) {break play;}
            coin.x = 338;
            stage.addChild(coin);
        } else {
            if (win == true) {break play;}
            coin = placeCoin2(5);
            if (coin == null) {break play;}
            coin.x = 338;
            stage.addChild(coin);
        }
        board_1.isWinner();
        board_2.isWinner();
        if ((board_1._winner == true || board_2._winner == true) && win == false) {
            win = true;
            end();
        }
    });
    column_6.on('mousedown', function(e) {
        play: if (turn == 1) {
            if (win == true) {break play;}
            coin = placeCoin1(6);
            if (coin == null) {break play;}
            coin.x = 412;
            stage.addChild(coin);
        } else {
            if (win == true) {break play;}
            coin = placeCoin2(6);
            if (coin == null) {break play;}
            coin.x = 412;
            stage.addChild(coin);
        }
        board_1.isWinner();
        board_2.isWinner();
        if ((board_1._winner == true || board_2._winner == true) && win == false) {
            win = true;
            end();
        }
    });
    column_7.on('mousedown', function(e) {
        play: if (turn == 1) {
            if (win == true) {break play;}
            coin = placeCoin1(7);
            if (coin == null) {break play;}
            coin.x = 486;
            stage.addChild(coin);
        } else {
            if (win == true) {break play;}
            coin = placeCoin2(7);
            if (coin == null) {break play;}
            coin.x = 486;
            stage.addChild(coin);
        }
        board_1.isWinner();
        board_2.isWinner();
        if ((board_1._winner == true || board_2._winner == true) && win == false) {
            win = true;
            end();
        }
    });
}

// Place a new coin
function placeCoin1(column) {
    var row_height = board_1.add(column);
    if (row_height == -1) {
        return null;
    }
    var coin = new PIXI.Sprite(PIXI.loader.resources["coin_1"].texture);
    createCoin(coin);
    row_height = row_height % 7;
    board_2._gameBoard = board_1._gameBoard;
    coin.y = 588 - (74*row_height + 50);
    turn = 2;
    coin_1.x = -50;
    coinArray.push(coin);
    return coin;
}

// Place a new coin
function placeCoin2(column) {
    var row_height = board_2.add(column);
    if (row_height == -1) {
        return null;
    }
    var coin = new PIXI.Sprite(PIXI.loader.resources["coin_2"].texture);
    createCoin(coin);
    row_height = row_height % 7;
    board_1._gameBoard = board_2._gameBoard;
    coin.y = 588 - (74*row_height + 50);
    turn = 1;
    coin_2.x = -50;
    coinArray.push(coin);
    return coin;
}

// Game end function
function end() {
    var winBack = new PIXI.Graphics();
    winBack.beginFill(0xaebaba);
    winBack.drawRect(120, 160, 300, 300);
    winBack.endFill();
    stage.addChild(winBack);
    if (board_1._winner == true) {
        var endTitle = new PIXI.Text('Player 1', {fontFamily: 'Arial', fontSize: 35, fill: 0xf7dc6f });
        endTitle.x = 210;
        endTitle.y = 190;
        stage.addChild(endTitle);
        endingCoin = new PIXI.Sprite(PIXI.loader.resources["coin_1"].texture);
        endingCoin.interactive = true;
        endingCoin.scale.set(0.75, 0.75);
        endingCoin.anchor.set(0.5, 0.5);
        endingCoin.x = 270;
        endingCoin.y = 300;
        stage.addChild(endingCoin);
        endCoin = true;
        var endWin = new PIXI.Text('Won', {fontFamily: 'Arial', fontSize: 40, fill: 0xf7dc6f });
        endWin.x = 230;
        endWin.y = 370;
        stage.addChild(endWin);
        var playAgain = new PIXI.Text('play again?', {fontFamily: 'Arial', fontSize: 25, fill: 0xfdfefe  });
        playAgain.interactive = true;
        playAgain.x = 210;
        playAgain.y = 420;
        playAgain.buttonMode = true;
        stage.addChild(playAgain);
    } else {
        var endTitle = new PIXI.Text('Player 2', {fontFamily: 'Arial', fontSize: 35, fill: 0xf7dc6f });
        endTitle.x = 210;
        endTitle.y = 190;
        stage.addChild(endTitle);
        endingCoin = new PIXI.Sprite(PIXI.loader.resources["coin_2"].texture);
        endingCoin.interactive = true;
        endingCoin.scale.set(0.75, 0.75);
        endingCoin.anchor.set(0.5, 0.5);
        endingCoin.x = 270;
        endingCoin.y = 300;
        endCoin = true;
        stage.addChild(endingCoin);
        var endWin = new PIXI.Text('Won', {fontFamily: 'Arial', fontSize: 40, fill: 0xf7dc6f });
        endWin.x = 230;
        endWin.y = 370;
        stage.addChild(endWin);
        var playAgain = new PIXI.Text('play again?', {fontFamily: 'Arial', fontSize: 25, fill: 0xfdfefe  });
        playAgain.interactive = true;
        playAgain.x = 210;
        playAgain.y = 420;
        playAgain.buttonMode = true;
        stage.addChild(playAgain);
    }
    playAgain.on('mousedown', function(e) {
        endCoin = false;
        board_1 = new playerBoard();
        board_2 = new playerBoard();
        win = false;
        var coins = coinArray.length;
        for (var i = 0; i < coins; i++) {
            stage.removeChild(coinArray[i]);
        }
        coinArray = new Array();
        stage.removeChild(endWin);
        stage.removeChild(playAgain);
        stage.removeChild(endTitle);
        stage.removeChild(endingCoin);
        stage.removeChild(winBack);
    });
}

// Animation function
function connectLoop() {
    requestAnimationFrame(connectLoop);

    if (turn == 1) {
        coin_1.x = renderer.plugins.interaction.mouse.global.x;
    }
    if (turn == 2) {
        coin_2.x = renderer.plugins.interaction.mouse.global.x;
    }
    if (endCoin == true) {
        endingCoin.rotation += 0.1;
    }

    renderer.render(stage);
}

},{"./board.js":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);

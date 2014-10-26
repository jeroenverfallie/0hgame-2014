(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Cell = function() {
  var Cell = function Cell(x, y) {
      this.x = x;
      this.y = y;

      this.alive = false;
      this.newAlive = false;

      this.lastAlive = 10000;
  };

  Object.defineProperties(Cell.prototype, {
    update: {
      writable: true,

      value: function(count) {
          this.newAlive = this.alive ? count > 1 && count < 4 : count === 3;

          this.lastAlive = this.alive ? 1 : this.lastAlive+3;
      }
    },

    draw: {
      writable: true,

      value: function(ctx, cs, h) {
          this.alive = this.newAlive;

          ctx.fillStyle = 'hsl('+h+', '+Math.round(100/this.lastAlive)+'%, '+Math.round(60/this.lastAlive)+'%)';
          ctx.fillRect(this.x * cs, this.y * cs, cs, cs);
      }
    }
  });

  return Cell;
}();

exports.default = Cell;


},{}],2:[function(require,module,exports){
"use strict";
var raf = require('./raf').default;
var Grid = require('./grid').default;

var Game = function() {
  var Game = function Game(elementId, gridSize, cellSize, stats) {
      this.gridSize = gridSize;
      this.cellSize = cellSize;

      this.actualGridSize = (gridSize / cellSize) >> 0;

      this.grid = new Grid(this.actualGridSize, this.cellSize);

      this.setupDOM(elementId);

      this.stats = stats;
  };

  Object.defineProperties(Game.prototype, {
    setupDOM: {
      writable: true,

      value: function(elementId) {
          this.canvas = document.getElementById(elementId);
          this.ctx = this.canvas.getContext('2d');

          this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
          this.canvas.addEventListener('mousemove', this.mousemove.bind(this));
          this.canvas.addEventListener('mouseup', this.mouseup.bind(this));
      }
    },

    mousedown: {
      writable: true,

      value: function(e) {
          this.down = true;
          this.grid.pulse(Math.round(e.offsetX / this.cellSize), Math.round(e.offsetY / this.cellSize));
      }
    },

    mousemove: {
      writable: true,

      value: function(e) {
          if (this.down) {
              this.grid.pulse(Math.round(e.offsetX / this.cellSize), Math.round(e.offsetY / this.cellSize));
          }
      }
    },

    mouseup: {
      writable: true,

      value: function(e) {
          this.down = false;
      }
    },

    start: {
      writable: true,

      value: function() {
          this.tick();
      }
    },

    tick: {
      writable: true,

      value: function() {
          this.stats && this.stats.begin();

          this.canvas.width = this.gridSize;

          

          this.grid.update();
          this.grid.draw(this.ctx);

          this.stats && this.stats.end();
          raf(this.tick.bind(this));
      }
    }
  });

  return Game;
}();

exports.default = Game;


},{"./grid":3,"./raf":5}],3:[function(require,module,exports){
"use strict";
var Cell = require('./cell').default;

var _cell, _i, _n, _neighbours, _x, _y;

var Grid = function() {
  var Grid = function Grid(gridSize, cellSize) {
      this.gridSize = gridSize;
      this.cellSize = cellSize;

      this.gridSize2 = this.gridSize * this.gridSize;
      this.cells = [];
      for (_y = 0; _y < gridSize; _y++) {
          for (_x = 0; _x < gridSize; _x++) {
              this.cells.push(new Cell(_x, _y));
          }
      }

      this.h = 0;
  };

  Object.defineProperties(Grid.prototype, {
    pulse: {
      writable: true,

      value: function(_x, _y, s) {
          if (!s) {
              var r = [
                  [
                      [_x - 1, _y - 1],
                      [_x, _y - 1],
                      [_x - 2, _y],
                      [_x + 1, _y],
                      [_x - 1, _y + 1],
                      [_x, _y + 1]
                  ],
                  [
                      [_x, _y - 1],
                      [_x+1, _y],
                      [_x-1, _y+1],
                      [_x, _y+1],
                      [_x+1, _y + 1]
                  ],
                  [
                      [_x, _y - 3],
                      [_x+1, _y - 3],
                      [_x-2, _y+1],
                      [_x+1, _y+1],
                      [_x+1, _y + 1]
                  ]
              ];

              r = r[Math.floor(Math.random() * r.length)];
              for (var _ii = 0, _nn = r.length; _ii < _nn; _ii++) {
                  this.pulse(r[_ii][0], r[_ii][1], true);
              }
          } else {
              _i = _x + _y * this.gridSize;
              if (_i > 0 && _i < this.gridSize2) {
                  this.cells[_i].alive = true;
              }
          }
      }
    },

    update: {
      writable: true,

      value: function() {
          var _xx = (Math.random() * this.gridSize) >> 0;
          var _yy = (Math.random() * this.gridSize) >> 0;
          this.pulse(_xx, _yy);
          this.pulse(_xx + 2, _yy + 2);


          for (_i = 0, _n = this.gridSize2; _i < _n; _i++) {
              _cell = this.cells[_i];
              _cell.update(this.countAliveNeighbours(_cell));
          }
      }
    },

    countAliveNeighbours: {
      writable: true,

      value: function(_cell) {
          // console.log(cell);
          _x = _cell.x;
          _y = _cell.y;
          _neighbours = [
              [_x - 1, _y - 1],
              [_x, _y - 1],
              [_x + 1, _y - 1],
              [_x - 1, _y - 1],
              [_x + 1, _y],
              [_x - 1, _y + 1],
              [_x, _y + 1],
              [_x + 1, _y + 1]
          ];

          var __n = 0;
          for (var __i = 0; __i < 8; __i++) {
              var __cell = _neighbours[__i];
              var _c = __cell[0] + __cell[1] * this.gridSize;
              if (_c > 0 && _c < this.gridSize2) {
                  __cell = this.cells[_c];
                  if (__cell && __cell.alive) {
                      __n++;
                  }
              }
          }

          return __n;
      }
    },

    draw: {
      writable: true,

      value: function(ctx) {
          this.h = (this.h+1) % 360;

          for (_i = 0, _n = this.gridSize2; _i < _n; _i++) {
              _cell = this.cells[_i];
              _cell.draw(ctx, this.cellSize, this.h);
          }
      }
    }
  });

  return Grid;
}();

exports.default = Grid;


},{"./cell":1}],4:[function(require,module,exports){
"use strict";
var Game = require('./game').default;

var _DEBUG = false;

if (_DEBUG) {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);
}

var game = new Game('game', 2000, 20, stats);
game.start();

},{"./game":2}],5:[function(require,module,exports){
"use strict";

exports.default = (function(){
  return  function( callback ){
            window.setTimeout(callback, 1000 / 10);
          };
})();

},{}]},{},[4]);

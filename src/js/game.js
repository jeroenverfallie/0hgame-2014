import raf from './raf';

import Grid from './grid';

class Game {
    constructor(elementId, gridSize, cellSize, stats) {
        this.gridSize = gridSize;
        this.cellSize = cellSize;

        this.actualGridSize = (gridSize / cellSize) >> 0;

        this.grid = new Grid(this.actualGridSize, this.cellSize);

        this.setupDOM(elementId);

        this.stats = stats;
    }

    setupDOM(elementId) {
        this.canvas = document.getElementById(elementId);
        this.ctx = this.canvas.getContext('2d');

        this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
        this.canvas.addEventListener('mousemove', this.mousemove.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseup.bind(this));
    }

    mousedown(e) {
        this.down = true;
        this.grid.pulse(Math.round(e.offsetX / this.cellSize), Math.round(e.offsetY / this.cellSize));
    }

    mousemove(e) {
        if (this.down) {
            this.grid.pulse(Math.round(e.offsetX / this.cellSize), Math.round(e.offsetY / this.cellSize));
        }
    }

    mouseup(e) {
        this.down = false;
    }

    start() {
        this.tick();
    }

    tick() {
        this.stats && this.stats.begin();

        this.canvas.width = this.gridSize;

        

        this.grid.update();
        this.grid.draw(this.ctx);

        this.stats && this.stats.end();
        raf(this.tick.bind(this));
    }
}

export default Game;

import Cell from './cell';

let cell, i, n, neighbours, x, y;

class Grid {
    constructor(gridSize, cellSize) {
        this.gridSize = gridSize;
        this.cellSize = cellSize;

        this.gridSize2 = this.gridSize * this.gridSize;
        this.cells = [];
        for (y = 0; y < gridSize; y++) {
            for (x = 0; x < gridSize; x++) {
                this.cells.push(new Cell(x, y));
            }
        }

        this.h = 0;
    }

    pulse(x, y, s) {
        if (!s) {
            var r = [
                [
                    [x - 1, y - 1],
                    [x, y - 1],
                    [x - 2, y],
                    [x + 1, y],
                    [x - 1, y + 1],
                    [x, y + 1]
                ],
                [
                    [x, y - 1],
                    [x+1, y],
                    [x-1, y+1],
                    [x, y+1],
                    [x+1, y + 1]
                ],
                [
                    [x, y - 3],
                    [x+1, y - 3],
                    [x-2, y+1],
                    [x+1, y+1],
                    [x+1, y + 1]
                ]
            ];

            r = r[Math.floor(Math.random() * r.length)];
            for (let ii = 0, nn = r.length; ii < nn; ii++) {
                this.pulse(r[ii][0], r[ii][1], true);
            }
        } else {
            i = x + y * this.gridSize;
            if (i > 0 && i < this.gridSize2) {
                this.cells[i].alive = true;
            }
        }
    }

    update() {
    	let xx = (Math.random() * this.gridSize) >> 0;
    	let yy = (Math.random() * this.gridSize) >> 0;
        this.pulse(xx, yy);
        this.pulse(xx + 2, yy + 2);


        for (i = 0, n = this.gridSize2; i < n; i++) {
            cell = this.cells[i];
            cell.update(this.countAliveNeighbours(cell));
        }
    }

    countAliveNeighbours(cell) {
        // console.log(cell);
        x = cell.x;
        y = cell.y;
        neighbours = [
            [x - 1, y - 1],
            [x, y - 1],
            [x + 1, y - 1],
            [x - 1, y - 1],
            [x + 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1]
        ];

        let n = 0;
        for (let i = 0; i < 8; i++) {
            let cell = neighbours[i];
            let c = cell[0] + cell[1] * this.gridSize;
            if (c > 0 && c < this.gridSize2) {
                cell = this.cells[c];
                if (cell && cell.alive) {
                    n++;
                }
            }
        }

        return n;
    }

    draw(ctx) {
    	this.h = (this.h+1) % 360;

        for (i = 0, n = this.gridSize2; i < n; i++) {
            cell = this.cells[i];
            cell.draw(ctx, this.cellSize, this.h);
        }
    }
}

export default Grid;

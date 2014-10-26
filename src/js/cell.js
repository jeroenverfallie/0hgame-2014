class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.alive = false;
        this.wasAlive = false;

        this.lastAlive = 10000;
    }

    update(count) {
        this.alive = this.alive ? count > 1 && count < 4 : count === 3;

    	this.lastAlive = this.alive ? 1 : this.lastAlive+3;
    }

    draw(ctx, cs, h) {
        ctx.fillStyle = 'hsl('+h+', '+Math.round(100/this.lastAlive)+'%, '+Math.round(60/this.lastAlive)+'%)';
        ctx.fillRect(this.x * cs, this.y * cs, cs, cs);
    }
}

export default Cell;

/**
 * basically a FIFO queue of tiles
 * display for players buzzing in, in order, first tile highlighted
 */
class Queue extends DisplayItem {
    /**
     * 
    */
    constructor() {
        super()

        this.tiles = []
    }

    /**
     * just the dimensions of the first tile, the other names extend below
     */
    resize(x, y, w, h) {
        super.resize(x, y, w, h)
        for (let i = 0; i < this.tiles.length; i++)
            this.tiles[i].resize(x, y+i*h, w, h)
    }

    /**
     * push to end of queue
     */
    push(content) {
        this.tiles.push(new Tile(TILES.TEXT, content, true))
        this.tiles[0].setTextOnly(false)
        this.resize(this.x, this.y, this.w, this.h)
    }

    /**
     * pop first in queue
     */
    pop() {
        this.tiles.shift()
        if (this.tiles.length > 0)
            this.tiles[0].setTextOnly(false)
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        c.beginPath()

        for (let tile of this.tiles)
            tile.draw(c)
    }
}
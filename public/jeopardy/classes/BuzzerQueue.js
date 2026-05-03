/**
 * basically a FIFO queue of tiles
 * display for players buzzing in, in order, first tile highlighted
 * with correct/incorrect buttons
 */
class BuzzerQueue extends DisplayItem {
    /**
     * 
    */
    constructor() {
        super()

        this.correctTile = new Tile(TILES.TEXT, "correct", {backColor: COLORS.VALUE_TEXT})
        this.incorrectTile = new Tile(TILES.TEXT, "incorrect", {backColor: COLORS.INACTIVE})
        this.playerTiles = []
        this.maxDisplayed = 5
    }

    /**
     * sets new dimensions
     */
    resize(x, y, w, h) {
        super.resize(x, y, w, h)

        const borderRatio = 0.03
        const tileW = w * (1-2*borderRatio)
        const tileH = h/(this.maxDisplayed+1) * (1-2*borderRatio)
        const tileX = x + borderRatio * tileW
        let tileY = y + 3*borderRatio * tileH

        this.correctTile.resize(tileX, tileY, tileW/2*(1-borderRatio/2), tileH)
        this.incorrectTile.resize(tileX+tileW/2*(1+borderRatio/2), tileY, tileW/2*(1-borderRatio/2), tileH)

        for (let i = 0; i < this.playerTiles.length; i++) {
            tileY += h/(this.maxDisplayed+1)
            this.playerTiles[i].resize(tileX, tileY, tileW, tileH)
        }
    }

    /**
     * push to end of queue
     */
    push(player) {
        this.playerTiles.push(new Tile(TILES.TEXT, player, {displayBack: false}))
        this.playerTiles[0].setDisplayBack(true)
        this.resize(this.x, this.y, this.w, this.h)
    }

    /**
     * pop first in queue
     */
    pop() {
        this.playerTiles.shift()
        if (this.playerTiles.length > 0)
            this.playerTiles[0].setDisplayBack(true)
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        c.beginPath()

        c.strokeStyle = COLORS.INACTIVE
        c.lineWidth = this.w/100
        c.roundRect(this.x, this.y, this.w, this.h, this.w/20)
        c.stroke()

        this.correctTile.draw(c)
        this.incorrectTile.draw(c)
        for (let i = 0; i < this.playerTiles.length && i < this.maxDisplayed; i++) {
            this.playerTiles[i].draw(c)
            c.globalAlpha -= 1/this.maxDisplayed
        }
        c.globalAlpha = 1.0
    }
}
/**
 * basically a FIFO queue of tiles
 * display for players buzzing in, in order, first tile highlighted
 * with correct/incorrect buttons
 */
class BuzzerQueue extends DisplayItem {
    /**
     * 
    */
    constructor({displayButtons=true} = {}) {
        super()

        this.correctTile = new Tile("Correct", {textColor: COLORS.BLACK, backColor: COLORS.GOLD})
        this.incorrectTile = new Tile("Incorrect", {textColor: COLORS.BLACK, backColor: COLORS.GRAY})

        this.playerTiles = []
        this.maxDisplayed = 5

        this.displayButtons = displayButtons
    }

    /**
     * sets new dimensions
     */
    resize(x, y, w, h) {
        super.resize(x, y, w, h)

        const borderRatio = 0.03
        const tileW = w * (1-2*borderRatio)
        let tileH = h/(this.maxDisplayed+1) * (1-2*borderRatio)
        const tileX = x + borderRatio * tileW
        let tileY = y + 3*borderRatio * tileH
        if (!this.displayButtons)
            tileH = h/(this.maxDisplayed) * (1-2*borderRatio)

        this.correctTile.resize(tileX, tileY, tileW/2*(1-borderRatio/2), tileH)
        this.incorrectTile.resize(tileX+tileW/2*(1+borderRatio/2), tileY, tileW/2*(1-borderRatio/2), tileH)

        for (let i = 0; i < this.playerTiles.length; i++) {
            if (this.displayButtons)
                tileY += h/(this.maxDisplayed+1)
            this.playerTiles[i].resize(tileX, tileY, tileW, tileH)
            if (!this.displayButtons)
                tileY += h/(this.maxDisplayed)
        }
    }

    /**
     * push to end of queue
     */
    push(player) {
        this.playerTiles.push(new Tile(player, {displayBack: false}))
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
        this.resize(this.x, this.y, this.w, this.h)
    }

    /**
     * clears queue
     */
    clear() {
        this.playerTiles.length = 0
    }

    /**
     * sets hovering for correct and incorrect tiles
     */
    hover(x, y) {
        if (this.playerTiles.length !== 0) {
            this.correctTile.hover(x, y)
            this.incorrectTile.hover(x, y)
        }
    }

    /**
     * returns object: {clicked: bool, correct: bool, team: string}
     *  clicked: true if click on either button
     *  correct: true if 'correct' button clicked
     *  player: player name
     */
    click(x, y) {
        if (this.playerTiles.length !== 0) {
            const player = this.playerTiles[0].getContent()
            if (this.correctTile.click(x, y)) {
                return {clicked: true, correct: true, player}
            } else if (this.incorrectTile.click(x, y)) {
                this.pop()
                return {clicked: true, correct: false, player}
            }
            return {clicked: false}
        }
        return {clicked: false}
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        c.beginPath()

        c.strokeStyle = COLORS.GRAY
        c.lineWidth = this.borderWidth
        c.roundRect(this.x, this.y, this.w, this.h, this.cornerRadii)
        c.stroke()

        if (this.playerTiles.length === 0)
            c.globalAlpha = 0.5
        if (this.displayButtons) {
            this.correctTile.draw(c)
            this.incorrectTile.draw(c)
        }
        
        for (let i = 0; i < this.playerTiles.length && i < this.maxDisplayed; i++) {
            this.playerTiles[i].draw(c)
            c.globalAlpha -= 1/this.maxDisplayed
        }

        c.globalAlpha = 1.0
    }
}
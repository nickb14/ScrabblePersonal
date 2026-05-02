/**
 * the jeopardy board
 * made of tiles (headers, values, and clues)
 */
class Board extends DisplayItem {
    /**
     * data: board array
    */
    constructor(data) {
        super()

        this.tiles = []
        this.clues = []

        for (let i = 0; i < data.length; i++) {
            this.tiles.push([new Tile(TILES.HEADER, data[i]["category"])])
            for (let clue of data[i]["clues"]) {
                this.tiles[i].push(new Tile(TILES.VALUE, clue["value"]))
                this.clues.push(new Tile(TILES.TEXT, clue["clue"]))
            }
        }

        this.currentClue = -1
    }

    /**
     * sets dimensions of tiles in this board
     */
    resize(x, y, w, h) {
        super.resize(x, y, w, h)

        const borderRatio = 0.03
        const tileW = w/this.tiles.length * (1-2*borderRatio)
        for (let i = 0; i < this.tiles.length; i++) {
            const tileH = h/this.tiles[i].length * (1-2*borderRatio)
            for (let j = 0; j < this.tiles[i].length; j++) {
                const tileX = x + (i+(2*i+1)*borderRatio) * tileW
                const tileY = y+(j+(2*j+1)*borderRatio)*tileH
                this.tiles[i][j].resize(tileX, tileY, tileW, tileH)
            }
        }

        for (let clue of this.clues)
            clue.resize(x, y, w, h)
    }

    /**
     * sets hovering for each value tile
     */
    hover(x, y) {
        if (this.currentClue != -1) {
            this.clues[this.currentClue].hover(x, y)
            return
        }
        for (let col of this.tiles) {
            for (let tile of col.slice(1)) {
                tile.hover(x, y)
            }
        }
    }

    /**
     * clicks into clue
     * returns object: {clicked: bool, index: number}
     *  clicked: true if click was within the bounds of the board
     *  index: of currently displayed clue
     */
    click(x, y) {
        if (this.currentClue != -1 && this.clues[this.currentClue].click(x, y)) {
            this.currentClue = -1
            return {clicked: true, index: this.currentClue}
        }
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 1; j < this.tiles[i].length; j++) {
                const tile = this.tiles[i][j]
                if (tile.click(x, y)) {
                    tile.setActive(false)
                    this.currentClue = i*(this.tiles[i].length-1) + j-1
                    return {clicked: true, index: this.currentClue}
                }
            }
        }
        return {clicked: false, index: this.currentClue}
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        if (this.currentClue != -1) {
            this.clues[this.currentClue].draw(c)
            return
        }
        for (let col of this.tiles) {
            for (let tile of col) {
                tile.draw(c)
            }
        }
    }


}
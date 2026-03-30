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
        // this.data = data

        this.tiles = []
        for (let i = 0; i < data.length; i++) {
            this.tiles.push([])
            this.tiles[i].push(new Tile(TILES.HEADER, data[i]["category"]))
            for (let clue of data[i]["clues"]) {
                this.tiles[i].push(new Tile(TILES.VALUE, clue["value"]))
            }
        }
        console.log(this.tiles) 
    }

    /**
     * sets dimensions of tiles in this board
     */
    resize(x, y, w, h) {
        super.resize(x, y, w, h)

        const tileW = w/this.tiles.length
        for (let i = 0; i < this.tiles.length; i++) {
            const tileH = h/this.tiles[i].length
            for (let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].resize(x+i*tileW, y+j*tileH, tileW, tileH)
            }
        }
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        for (let col of this.tiles) {
            for (let tile of col) {
                tile.draw(c)
            }
        }
    }


}
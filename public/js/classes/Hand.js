class Hand {
    constructor() {
        this.x = TILE_SIZE
        this.y = TILE_SIZE*17
        this.tiles = []
        this.placedTiles = []
    }

    //takes tiles from (bag) so that there are 7 tiles left in this hand
    // (or as many tiles as there are left in the bag)
    // (also resets placedTiles)
    drawTiles(bag) {
        if (bag instanceof Bag)
            this.tiles.push(...bag.drawTiles(7-this.tiles.length))
        this.placedTiles = []
        this.alignTiles()
    }

    //returns how many more tiles this hand can hold (7-length)
    emptyTiles() {
        return 7-this.tiles.length
    }

    //moves all of the tiles so they are lined up on the "rack"
    alignTiles() {
        this.tiles.sort((a, b) => a.x-b.x)
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].move(this.x + TILE_SIZE*i, this.y)
        }
    }

    //returns the tile in position (x, y) (or null)
    grabTile(x, y) {
        for (let tile of this.tiles) {
            if (tile.clicked(x, y)) {
                return tile
            }
        }
        return null
    }

    //removes tile from this hand (places it on the board)
    placeTile(tile) {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i] == tile) {
                this.tiles.splice(i, 1)
                this.placedTiles.push(tile)
                return
            }
        }
    }

    //deletes this tile from existence (if it is in this hand)
    purgeTile(tile) {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i] == tile) {
                this.tiles.splice(i, 1)
                return
            }
        }
    }

    //removes all tiles from this hand and returns them (like, to put back into the bag)
    returnTiles() {
        const tiles = this.tiles
        this.tiles = []
        return tiles
    }

    //puts tile back into this hand (removes from the board)
    addTile(tile) {
        for (let i = 0; i < this.placedTiles.length; i++) {
            if (this.placedTiles[i] == tile) {
                this.placedTiles.splice(i, 1)
                break
            }
        }
        this.tiles.push(tile)
    }

    //puts all placed tiles (on the board) back into this hand
    reset() {
        this.tiles.push(...this.placedTiles)
        this.placedTiles = []
    }

    //returns the sum of the tile values (for negative end game points)
    score() {
        let sum = 0
        this.tiles.forEach((tile) => {sum += tile.getValue()})
        return sum
    }

    draw(c) {
        this.tiles.forEach((tile) => {tile.draw(c)})
        c.beginPath()
        c.moveTo(this.x-TILE_SIZE/2, this.y+TILE_SIZE/2)
        c.lineTo(this.x-TILE_SIZE/2 + TILE_SIZE*7, this.y+TILE_SIZE/2)
        c.stroke()
    }
}
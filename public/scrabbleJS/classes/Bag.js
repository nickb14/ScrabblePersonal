class Bag {
    constructor() {
        this.x = TILE_SIZE*16
        this.y = TILE_SIZE
        this.tiles = []
    }

    //puts in the 100 initial tiles
    initializeTiles() {
        this.tiles.length = 0
        const counts = {
            'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12,
            'F': 2, 'G': 3, 'H': 2, 'I': 9, 'J': 1,
            'K': 1, 'L': 4, 'M': 2, 'N': 6, 'O': 8,
            'P': 2, 'Q': 1, 'R': 6, 'S': 4, 'T': 6,
            'U': 4, 'V': 2, 'W': 2, 'X': 1, 'Y': 2,
            'Z': 1, ' ': 2
        }
        for (const letter in counts) {
            for (let i = 0; i < counts[letter]; i++) {
                this.tiles.push(new Tile(letter))
            }
        }
    }

    //getting (and removing) (num) number of tiles from the bag
    drawTiles(num) {
        const tiles = []
        for (let i = 0; i < num && this.tiles.length > 0; i++) {
            tiles.push(this.drawTile())
        }
        return tiles
    }

    //gets a random tile (and removes it from the bag)
    drawTile() {
        const i = Math.floor(Math.random() * this.tilesLeft())
        const tile = this.tiles[i]
        this.tiles.splice(i, 1)
        return tile
    }

    //puts (tiles) back into the bag
    returnTiles(tiles) {
        this.tiles.push(...tiles)
    }

    //returns the number of tiles in the bag
    tilesLeft() {
        return this.tiles.length
    }

    draw(c) {
        c.beginPath()
        c.font = TILE_SIZE*2/3 + "px Arial"
        c.fillStyle = "black"
        c.textAlign = "left"
        c.textBaseline = "middle"
        c.fillText("tiles in bag: " + this.tilesLeft(), this.x, this.y)
    }

    toArray() {
        const array = []
        this.tiles.forEach((tile) => {array.push(tile.getLetter())})
        return array
    }

    fromArray(array) {
        this.tiles.length = 0
        array.forEach((letter) => {this.tiles.push(new Tile(letter))})
    }
}
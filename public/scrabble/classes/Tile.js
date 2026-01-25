class Tile {
    constructor(letter) {
        this.x = 0
        this.y = 0
        this.letter = letter
        this.value = Tile.letterValue(letter)
    }

    //numeric value of a letter
    static letterValue(letter) {
        const values = {
            'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1,
            'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
            'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1,
            'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1,
            'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4,
            'Z': 10, ' ': 0
        }
        return values[letter]
    } 

    //moves tile to (x, y) position
    move(x, y) {
        this.x = x
        this.y = y
    }

    getValue() {
        return this.value
    }

    getLetter() {
        return this.letter
    }

    //returns true if (x, y) is on top of this tile
    clicked(x, y) {
        const half = TILE_SIZE/2
        if (x < this.x-half || x > this.x+half || y < this.y-half || y > this.y+half)
            return false
        return true
    }

    draw(c) {
        c.beginPath()

        c.fillStyle = "burlywood"
        c.fillRect(this.x-TILE_SIZE/2, this.y-TILE_SIZE/2, TILE_SIZE, TILE_SIZE)

        c.font = TILE_SIZE*2/3 + "px Arial"
        c.fillStyle = "black"
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.fillText(this.letter, this.x, this.y)

        c.font = TILE_SIZE/3 + "px Arial"
        c.textAlign = "right"
        c.textBaseline = "bottom"
        c.fillText(this.value, this.x+TILE_SIZE/2, this.y+TILE_SIZE/2)
    }
}
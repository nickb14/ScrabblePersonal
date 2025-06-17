class Board {
    constructor() {
        this.x = TILE_SIZE
        this.y = TILE_SIZE
        this.squares = []
        this.tiles = []
        this.placedTiles = []
        this.blanks = []
        for (let i = 0; i < 15; i++) {
            this.squares.push(new Array(15).fill(null))
            this.tiles.push(new Array(15).fill(null))
            this.placedTiles.push(new Array(15).fill(null))
            this.blanks.push(new Array(15).fill(null))
        }

        //initializing all of the premium squares
        const counts = [
            [0, 0, 'triple', 'word'], [0, 7, 'triple', 'word'], [0, 14, 'triple', 'word'],
            [7, 0, 'triple', 'word'], [7, 14, 'triple', 'word'],
            [14, 0, 'triple', 'word'], [14, 7, 'triple', 'word'], [14, 14, 'triple', 'word'],

            [1, 1, 'double', 'word'], [2, 2, 'double', 'word'], [3, 3, 'double', 'word'],
            [4, 4, 'double', 'word'], [7, 7, 'double', 'word'],
            [10, 10, 'double', 'word'], [11, 11, 'double', 'word'], [12, 12, 'double', 'word'],
            [13, 13, 'double', 'word'], [1, 13, 'double', 'word'], [2, 12, 'double', 'word'],
            [3, 11, 'double', 'word'], [4, 10, 'double', 'word'], [10, 4, 'double', 'word'],
            [11, 3, 'double', 'word'], [12, 2, 'double', 'word'], [13, 1, 'double', 'word'],

            [1, 5, 'triple', 'letter'], [1, 9, 'triple', 'letter'],
            [5, 1, 'triple', 'letter'], [5, 5, 'triple', 'letter'], [5, 9, 'triple', 'letter'], [5, 13, 'triple', 'letter'],
            [9, 1, 'triple', 'letter'], [9, 5, 'triple', 'letter'], [9, 9, 'triple', 'letter'], [9, 13, 'triple', 'letter'],
            [13, 5, 'triple', 'letter'], [13, 9, 'triple', 'letter'],

            [0, 3, 'double', 'letter'], [0, 11, 'double', 'letter'],
            [2, 6, 'double', 'letter'], [2, 8, 'double', 'letter'],
            [3, 0, 'double', 'letter'], [3, 7, 'double', 'letter'], [3, 14, 'double', 'letter'],
            [6, 2, 'double', 'letter'], [6, 6, 'double', 'letter'], [6, 8, 'double', 'letter'], [6, 12, 'double', 'letter'],
            [7, 3, 'double', 'letter'], [7, 11, 'double', 'letter'],
            [8, 2, 'double', 'letter'], [8, 6, 'double', 'letter'], [8, 8, 'double', 'letter'], [8, 12, 'double', 'letter'],
            [11, 0, 'double', 'letter'], [11, 7, 'double', 'letter'], [11, 14, 'double', 'letter'],
            [12, 6, 'double', 'letter'], [12, 8, 'double', 'letter'],
            [14, 3, 'double', 'letter'], [14, 11, 'double', 'letter']
        ]

        counts.forEach((count) => {
            this.squares[count[0]][count[1]] = new Square(this.calcX(count[0]), this.calcY(count[1]), count[2], count[3])
        })
    }

    //converts from board x-coordinate (0 through 14) to canvas x-position
    calcX(x) {
        return this.x + TILE_SIZE*x
    }

    //converts from board y-coordinate (0 through 14) to canvas y-position
    calcY(y) {
        return this.y + TILE_SIZE*y
    }

    //attempts to place (tile) onto the board at position (x, y)
    //fails if coordinates are not on the board, or if the space is occupied by a tile placed in a previous turn
    //  can return tiles placed this turn and blanks back to this hand
    placeTile(x, y, tile, hand) {
        const half = TILE_SIZE/2
        if (x < this.x-half || x > this.x+half*29 || y < this.y-half || y > this.y+half*29)
            return
        const i = Math.floor((x-this.x+half) / TILE_SIZE)
        const j = Math.floor((y-this.y+half) / TILE_SIZE)
        if (this.tiles[i][j]) {
            if (this.tiles[i][j].getValue() == 0) {
                hand.addTile(this.tiles[i][j])
                this.tiles[i][j] = tile
            } else {
                return
            }
        } else if (this.placedTiles[i][j]) {
            hand.addTile(this.placedTiles[i][j])
            this.placedTiles[i][j] = tile
        } else {
            this.placedTiles[i][j] = tile
        }
        tile.move(this.calcX(i), this.calcY(j))
        hand.placeTile(tile)
    }

    //removes all tiles placed this turn
    //also resets blanks taken (purges them from the hand)
    reset(hand) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                this.placedTiles[i][j] = null
                if (this.blanks[i][j]) {
                    hand.purgeTile(this.blanks[i][j])
                    this.blanks[i][j].move(this.calcX(i), this.calcY(j))
                    this.tiles[i][j] = this.blanks[i][j]
                }
            }
        }
    }

    //returns the score of the current turn on the board
    // (0 points for invalid boards)
    score() {
        if (!this.valid())
            return 0
        //finding main column/row, start and end of word
        let column = -1, row = -1
        let startI = -1, startJ = -1
        let endI = -1, endJ = -1
        let numTiles = 0
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (this.placedTiles[i][j]) {
                    numTiles++
                    if (column == -1 && row == -1) {
                        column = startI = i;
                        row = startJ = j;
                    } else if (column != -1 && row != -1) {
                        if (column == i)
                            row = -1
                        else if (row == j)
                            column = -1
                        else
                            return false
                    } else if (column != i && row != j) {
                        return false
                    }
                    endI = i
                    endJ = j
                }
            }
        }
        //zero tiles case
        if (numTiles == 0)
            return 0
        //words
        let score = 0
        //bingo!
        if (numTiles == 7)
            score += 50
        let i = startI, j = startJ
        if (column != -1) {
            score += this.scoreColumn(i, j)
            while (this.isTileOrPlaced(i, j)) {
                if (this.placedTiles[i][j]) {
                    score += this.scoreRow(i, j)
                }
                j++
            }
        } else {
            score += this.scoreRow(i, j)
            while (this.isTileOrPlaced(i, j)) {
                if (this.placedTiles[i][j]) {
                    score += this.scoreColumn(i, j)
                }
                i++
            }
        }
        return score
    }

    //returns the score of the vertical word at board coordinates (i, startJ) 
    scoreColumn(i, startJ) {
        //single letter case
        if (!this.isTileOrPlaced(i, startJ-1) && !this.isTileOrPlaced(i, startJ+1))
            return 0

        let score = 0
        let wordMult = 1, letterMult = 1

        let j = startJ
        while (this.isTileOrPlaced(i, j-1)) {
            j--
        }
        while (this.isTileOrPlaced(i, j)) {
            if (this.squares[i][j] && this.placedTiles[i][j]) {
                wordMult *= this.squares[i][j].wordMult()
                letterMult = this.squares[i][j].letterMult()
            }
            score += this.tiles[i][j] ? this.tiles[i][j].getValue()*letterMult : this.placedTiles[i][j].getValue()*letterMult
            j++
            letterMult = 1
        }
        return score * wordMult
    }

    //returns the score of the horizontal word at board coordinates (i, startJ) 
    scoreRow(startI, j) {
        //single letter case
        if (!this.isTileOrPlaced(startI-1, j) && !this.isTileOrPlaced(startI+1, j))
            return 0

        let score = 0
        let wordMult = 1, letterMult = 1
        
        let i = startI
        while (this.isTileOrPlaced(i-1, j)) {
            i--
        }
        while (this.isTileOrPlaced(i, j)) {
            if (this.squares[i][j] && this.placedTiles[i][j]) {
                wordMult *= this.squares[i][j].wordMult()
                letterMult = this.squares[i][j].letterMult()
            }
            score += this.tiles[i][j] ? this.tiles[i][j].getValue()*letterMult : this.placedTiles[i][j].getValue()*letterMult
            i++
            letterMult = 1
        }
        return score * wordMult
    }

    //returns whether a coordinate (i, j) is occupied
    isTileOrPlaced(i, j) {
        if (i < 0 || i > 14 || j < 0 || j > 14)
            return false
        return this.tiles[i][j] || this.placedTiles[i][j]
    }

    //returns whether a board is valid
    // no tiles placed is valid
    // all tiles placed this turn must all be part of one word, 
    //   and be attached to previous words (or the first turn center square)
    valid() {
        //all placed in same row/column
        let column = -1, row = -1
        let startI = -1, startJ = -1
        let endI = -1, endJ = -1
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (this.placedTiles[i][j]) {
                    if (column == -1 && row == -1) {
                        column = startI = i;
                        row = startJ = j;
                    } else if (column != -1 && row != -1) {
                        if (column == i)
                            row = -1
                        else if (row == j)
                            column = -1
                        else
                            return false
                    } else if (column != i && row != j) {
                        return false
                    }
                    endI = i
                    endJ = j
                }
            }
        }
        //zero tiles case
        if (column == -1 && row == -1) {
            return true
        }
        //forms at least one continuous word
        if (column != -1) {
            for (let j = startJ+1; j < endJ; j++) {
                if (!this.placedTiles[column][j] && !this.tiles[column][j]) {
                    return false
                }
            }
        } else {
            for (let i = startI+1; i < endI; i++) {
                if (!this.placedTiles[i][row] && !this.tiles[i][row]) {
                    return false
                }
            }
        }
        //attached to existing words (or is the first word)
        if (this.placedTiles[7][7] && (this.placedTiles[7][8] || this.placedTiles[7][6] || this.placedTiles[8][7] || this.placedTiles[6][7]))
            return true
        if (column != -1) {
            for (let j = startJ; j <= endJ; j++) {
                if (this.placedTiles[column][j]) {
                    if (this.isTile(column+1, j) || this.isTile(column-1, j) || this.isTile(column, j+1) || this.isTile(column, j-1))
                        return true
                }
            }
        } else {
            for (let i = startI; i <= endI; i++) {
                if (this.placedTiles[i][row]) {
                    if (this.isTile(i+1, row) || this.isTile(i-1, row) || this.isTile(i, row+1) || this.isTile(i, row-1))
                        return true
                }
            }
        }
        return false
    }

    //returns whether a coordinate (i, j) has a tile placed in a previous turn
    isTile(i, j) {
        if (i < 0 || i > 14 || j < 0 || j > 14)
            return false
        return this.tiles[i][j] != null
    }

    //sets all tiles placed this turn to tiles placed a previous turn
    // (also marks the blank tiles)
    endTurn() {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (this.placedTiles[i][j]) {
                    this.tiles[i][j] = this.placedTiles[i][j]
                    this.placedTiles[i][j] = null
                }
                if (this.tiles[i][j] && this.tiles[i][j].getValue() == 0)
                    this.blanks[i][j] = this.tiles[i][j]
                else
                    this.blanks[i][j] = null
            }
        }
    }

    //attempts to grab a tile in position (x, y) to return it to this hand
    grabTile(x, y, hand) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const tile = this.placedTiles[i][j]
                if (tile?.clicked(x, y)) {
                    this.placedTiles[i][j] = null
                    hand.addTile(tile)
                    return tile
                }
            }
        }
        return null
    }

    draw(c) {
        c.beginPath()
        
        this.squares.forEach((row) => {row.forEach((square) => {square?.draw(c)})})

        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                c.strokeRect(this.x-TILE_SIZE/2 + TILE_SIZE*i, this.y-TILE_SIZE/2 + TILE_SIZE*j, TILE_SIZE, TILE_SIZE)
            }
        }

        this.tiles.forEach((row) => {row.forEach((tile) => {tile?.draw(c)})})
        this.placedTiles.forEach((row) => {row.forEach((tile) => {tile?.draw(c)})})
    }

    toArray() {
        const array = []

        for (let i = 0; i < 15; i++) {
            array.push(new Array(15).fill(null))

            for (let j = 0; j < 15; j++) {
                if (this.tiles[i][j])
                    array[i][j] = this.tiles[i][j].getLetter()
            }
        }
        return array
    }

    fromArray(array) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (array[i][j]) {
                    const tile =  new Tile(array[i][j])
                    tile.move(this.calcX(i), this.calcY(j))
                    this.tiles[i][j] = tile
                    if (tile.getValue() == 0)
                        this.blanks[i][j] = tile
                }
                else {
                    this.tiles[i][j] = null
                    this.blanks[i][j] = null
                }
            }
        }
    }

}
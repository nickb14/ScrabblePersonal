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
        this.solutions = []

        for (let i = 0; i < data.length; i++) {
            this.tiles.push([new Tile(data[i]["category"], {lineLength: 10})])
            for (let clue of data[i]["clues"]) {
                this.tiles[i].push(new Tile(clue["value"], {textColor: COLORS.GOLD}))
                this.clues.push(new Tile(clue["clue"]))
                this.solutions.push(new Tile(clue["solution"]))
            }
        }

        this.currentClue = -1
        this.currentSolution = false
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
                const tileY = y + (j+(2*j+1)*borderRatio) * tileH
                this.tiles[i][j].resize(tileX, tileY, tileW, tileH)
            }
        }

        for (let clue of this.clues)
            clue.resize(x, y, w, h)
        for (let solution of this.solutions)
            solution.resize(x, y, w, h)
    }

    /**
     * gets value of current clue, 0 if no current
     */
    getValue() {
        if (this.currentClue != -1) {
            let clue = 0
            for (let i = 0; i < this.tiles.length; i++) {
                for (let j = 1; j < this.tiles[i].length; j++) {
                    if (clue == this.currentClue)
                        return this.tiles[i][j].getValue()
                    clue++
                }
            }
        }
        return 0
    }

    /**
     * directly sets clue to be displayed, by clue index
     */
    displayClue(clue) {
        this.currentClue = clue
        this.currentSolution = false
    }

    /**
     * displays solution of current clue
     */
    displaySolution() {
        if (this.currentClue !== -1)
            this.currentSolution = true
    }

    /**
     * sets no active clue displaying
     */
    returnToBoard() {
        this.currentClue = -1
        this.currentSolution = false
    }

    /**
     * marks the array of clues as already played
     * any clues not in the array marked as unplayed
     */
    setClues(clues) {
        let clue = 0
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 1; j < this.tiles[i].length; j++) {
                if (clues.includes(clue))
                    this.tiles[i][j].setTextColor(COLORS.BLUE)
                else
                    this.tiles[i][j].setTextColor(COLORS.GOLD)
                clue++
            }
        }
    }

    /**
     * sets hovering for each value tile
     */
    hover(x, y) {
        if (this.currentClue != -1) {
            if (!this.currentSolution)
                this.clues[this.currentClue].hover(x, y)
            else
                this.solutions[this.currentClue].hover(x, y)
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
     *  index: of clue if it was just clicked, -2 if displaying solution, -1 if returning to board
     */
    click(x, y) {
        if (this.currentClue !== -1) {
            if (!this.currentSolution && this.clues[this.currentClue].click(x, y)) {
                this.displaySolution()
                return {clicked: true, index: -2}
            } else if (this.currentSolution && this.solutions[this.currentClue].click(x, y)) {
                this.returnToBoard()
                return {clicked: true, index: -1}
            }
        }
        let clue = 0
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 1; j < this.tiles[i].length; j++) {
                const tile = this.tiles[i][j]
                if (tile.click(x, y)) {
                    tile.setTextColor(COLORS.BLUE)
                    this.currentClue = clue
                    return {clicked: true, index: this.currentClue}
                }
                clue++
            }
        }
        return {clicked: false, index: this.currentClue}
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        if (this.currentClue !== -1) {
            if (!this.currentSolution)
                this.clues[this.currentClue].draw(c)
            else
                this.solutions[this.currentClue].draw(c)
            return
        }
        for (let col of this.tiles) {
            for (let tile of col) {
                tile.draw(c)
            }
        }
    }

}
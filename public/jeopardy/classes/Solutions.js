/**
 * for displaying solutions (one at a time)
 * a collection of solution tiles, basically
 */
class Solutions extends DisplayItem {
    /**
     * data: board array
    */
    constructor(data) {
        super()

        this.hideTile = new Tile(TILES.TEXT, "Hide solutions")
        this.showTile = new Tile(TILES.TEXT, "Show solutions")

        this.solutions = []
        for (let category of data)
            for (let clue of category["clues"])
                this.solutions.push(new Tile(TILES.TEXT, clue["solution"]))

        this.currentSolution = -1
        this.currentTile = this.hideTile
    }

    /**
     * 
     */
    setCurrentSolution(index) {
        this.currentSolution = index
        if (this.currentTile !== this.showTile) {
            if (index > -1)
                this.currentTile = this.solutions[index]
            else
                this.currentTile = this.hideTile
        }
    }

    /**
     * sets dimensions
     */
    resize(x, y, w, h) {
        this.hideTile.resize(x, y, w, h)
        this.showTile.resize(x, y, w, h)
        for (let sol of this.solutions)
            sol.resize(x, y, w, h)
    }

    /**
     * sets hovering for currently displayed tile
     */
    hover(x, y) {
        this.currentTile.hover(x, y)
    }

    /**
     * click to toggle hide/show solutions
     */
    click(x, y) {
        if (this.currentTile.click(x, y)) {
            if (this.currentTile === this.showTile) {
                this.currentTile = this.hideTile
                this.setCurrentSolution(this.currentSolution)
            } else {
                this.currentTile = this.showTile
            }
        }
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        this.currentTile.draw(c)
    }


}
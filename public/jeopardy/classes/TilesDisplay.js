/**
 * for displaying solutions/contexts (one at a time)
 * a collection of tiles, basically
 */
class TilesDisplay extends DisplayItem {
    /**
     * data: board array
    */
    constructor(data, {type="solution", defaultStr="Hide Solutions"} = {}) {
        super()

        this.defaultTile = new Tile(defaultStr)
        this.hideTile = new Tile("Show solutions")

        this.tiles = []
        for (let category of data)
            for (let clue of category["clues"])
                this.tiles.push(new Tile(clue[type], {lineLength: 10}))

        this.currentIndex = -1
        this.currentTile = this.defaultTile
    }

    /**
     * 
     */
    setCurrentIndex(index) {
        this.currentIndex = index
        if (this.currentTile !== this.hideTile) {
            if (index > -1)
                this.currentTile = this.tiles[index]
            else
                this.currentTile = this.defaultTile
        }
    }

    /**
     * sets dimensions
     */
    resize(x, y, w, h) {
        super.resize(x, y, w, h)
        this.defaultTile.resize(x, y, w, h)
        this.hideTile.resize(x, y, w, h)
        for (let sol of this.tiles)
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
            if (this.currentTile === this.hideTile) {
                this.currentTile = this.defaultTile
                this.setCurrentSolution(this.currentIndex)
            } else {
                this.currentTile = this.hideTile
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
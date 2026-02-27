/**
 * any tile on the jeopardy board (header, value, clue, with answer, image)
 */
class Tile extends DisplayItem {
    /**
     * type: TILES.HEADER, TILES.VALUE, etc
     * content: string to display
    */
    constructor(type, content) {
        super()
        this.type = type
        this.content = content

        this.px = 0
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        c.fillStyle = COLORS.TILE_BACK
        c.fillRect(this.x, this.y, this.w, this.h)

        c.textAlign = "center"
        c.textBaseline = "middle"
        if (this.type = TILES.VALUE) {
            c.fillStyle = COLORS.VALUE_TEXT
            c.font = this.px + FONT
            const fWidth = this.w*0.9
            //shrinking
            while (c.measureText(this.content).width > fWidth + 1) {
                this.px -= 1
                c.font = this.px + FONT
            }
            //enlarging
            while (this.px < this.h/2 && c.measureText(this.content).width < fWidth - 1) {
                this.px += 1
                c.font = this.px + FONT
            }
            c.fillText(this.content, this.x+this.w/2, this.y+this.h/2)
        }
    }
}
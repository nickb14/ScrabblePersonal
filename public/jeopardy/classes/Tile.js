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
        this.lines = [content]

        this.px = 10

        if (type == TILES.HEADER) {
            //attempts to have line lengths no longer than 10 characters (10 is arbitrary)
            const maxLines = Math.min(Math.ceil(content.length/10), 3)
            this.splitText(content, maxLines)
        } else if (type == TILES.CLUE) {
            const maxLines = Math.min(Math.ceil(content.length/30), 5)
            this.splitText(content, maxLines)
        }
        this.longLine = this.lines.reduce((a, b) => a.length > b.length ? a : b)
    }

    /**
     * attempts to split content into this.lines
     * results in number of lines <= maxLines
     */
    splitText(content, maxLines) {
        const words = content.split(" ")
        this.lines = Array(maxLines).fill("")

        const totalLength = content.length
        const targetLength = totalLength / maxLines

        let i = 0
        for (let word of words) {
            if (this.lines[i].length + word.length > targetLength && this.lines[i].length > 0 && i < maxLines-1) {
                i++
            }

            if (this.lines[i].length > 0) {
                this.lines[i] += " "
            }
            this.lines[i] += word
        }

        while (this.lines.at(-1).length == 0)
            this.lines.pop()
    }

    /**
     * formats and draws text contained in this.lines
     * has active resizing based on tile dimensions
     */
    drawText(c) {
        c.font = this.px + FONT
        let maxPx = this.h / (this.lines.length+1)

        if (this.type == TILES.VALUE) {
            c.fillStyle = COLORS.VALUE_TEXT
        } else {
            c.fillStyle = COLORS.TEXT
        }

        const fWidth = this.w*0.9
        //shrinking
        while (this.px > maxPx || c.measureText(this.longLine).width > fWidth + 1) {
            this.px -= 1
            c.font = this.px + FONT
        }
        //enlarging
        while (this.px < maxPx && c.measureText(this.longLine).width < fWidth - 1) {
            this.px += 1
            c.font = this.px + FONT
        }

        for (let i = 0; i < this.lines.length; i++) {
            const h = this.y+this.h/2 - this.px/2*(this.lines.length-1) + this.px*i
            c.fillText(this.lines[i], this.x+this.w/2, h)
        }
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        c.fillStyle = COLORS.TILE_BACK
        c.fillRect(this.x, this.y, this.w, this.h)

        c.textAlign = "center"
        c.textBaseline = "middle"

        this.drawText(c)
    }
}
/**
 * any tile on the jeopardy board (header, value, clue, with answer, image)
 */
class Tile extends Button {
    /**
     * type: TILES.HEADER, TILES.VALUE, etc
     * content: string to display
    */
    constructor(type, content) {
        super()

        //text
        this.type = type
        this.lines = []
        this.px = 10
        this.longLine = ""

        this.setText(content)
    }

    /**
     * sets the text the tile displays
     */
    setText(content) {
        if (content === "")
            return

        if (this.type == TILES.HEADER) {
            //attempts to have line lengths no longer than 10 characters (10 is arbitrary)
            const maxLines = Math.min(Math.ceil(content.length/10), 3)
            this.splitText(content, maxLines)
        } else if (this.type == TILES.TEXT) {
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
        c.textAlign = "center"
        c.textBaseline = "middle"

        c.font = this.px + FONT
        let maxPx = this.h / (this.lines.length+1)

        if (this.type == TILES.VALUE) {
            c.fillStyle = COLORS.VALUE_TEXT
        } else {
            c.fillStyle = COLORS.TEXT
        }

        const fWidth = this.w*0.8
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
        c.beginPath()

        c.fillStyle = COLORS.TILE_BACK
        c.roundRect(this.x, this.y, this.w, this.h, this.w/20)
        c.fill()

        if (!this.active)
            return

        if (this.hovering) {
            c.strokeStyle = COLORS.TEXT
            c.lineWidth = this.w/100
            c.stroke()
        }

        this.drawText(c)
    }
}
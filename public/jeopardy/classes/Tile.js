/**
 * any tile on the jeopardy board (header, value, clue, with answer, image)
 */
class Tile extends Button {
    /**
     * type: TILES.HEADER, TILES.VALUE, etc
     * content: string or number(value tile) to display
     * displayBack: if false, doesn't draw tile background
     * backColor: for different tile background color than default
    */
    constructor(type, content, {displayBack = true, backColor = COLORS.TILE_BACK} = {}) {
        super()

        this.type = type

        //text
        this.px = 10
        this.lines = [content]
        this.longLine = content

        this.setText(content)

        //tile back
        this.displayBack = displayBack
        this.backColor = backColor
    }

    /**
     * sets the text the tile displays
     */
    setText(content) {
        //if value tile, content == number, keep as one line
        if (this.type === TILES.VALUE) {
            this.lines = [content]
            this.longLine = content
            return
        }
        //if only whitespace, treat as nothing
        if (content.trim().length === 0)
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
     * gets the value of a value tile
     */
    getValue() {
        if (this.type === TILES.VALUE)
            return this.longLine
        return 0
    }

    /**
     * sets whether tile back is displayed
     */
    setDisplayBack(displayBack) {
        this.displayBack = displayBack
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

        function isLight(hex) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return (r * 0.299 + g * 0.587 + b * 0.114) > 128;
        }

        if (this.type == TILES.VALUE) {
            c.fillStyle = COLORS.VALUE_TEXT
        } else if (isLight(this.backColor) && this.displayBack) {
            c.fillStyle = COLORS.BACKGROUND
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

        if (this.displayBack) {
            c.fillStyle = this.backColor
            c.roundRect(this.x, this.y, this.w, this.h, this.w/20)
            c.fill()
        }

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
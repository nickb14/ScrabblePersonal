/**
 * any tile on the jeopardy board (header, value, clue, with answer, image?)
 */
class Tile extends Button {
    /**
     * content: string or number(value tile) to display
     * textColor: for different fill text color than default white
     * lineLength: attempts to display lines of maximum this many characters
     * backColor: for different tile background color than default blue
     * displayBack: if false, doesn't draw tile background
    */
    constructor(content, {textColor=COLORS.WHITE, lineLength=30, backColor=COLORS.BLUE, displayBack=true} = {}) {
        super()

        //text
        this.px = 10
        this.textColor = textColor
        this.lineLength = lineLength
        
        //this.value
        //this.content
        //this.lines
        //this.longLine
        this.setContent(content)

        //tile back
        this.displayBack = displayBack
        this.backColor = backColor
    }

    /**
     * sets the text/value the tile displays
     * this.value, this.lines, this.longLine
     */
    setContent(content) {
        //value
        this.value = parseFloat(content)
        if (!isFinite(this.value))
            this.value = 0

        this.content = content.toString()
        this.lines = [this.content]
        this.longLine = this.content

        //if only whitespace, treat as nothing
        if (this.content.trim().length === 0)
            return

        //attempts max this.lineLength character lines; hard caps 5 lines total (arbitrary)
        const maxLines = Math.min(Math.ceil(this.content.length/this.lineLength), 5)
        this.splitText(maxLines)
        
        this.longLine = this.lines.reduce((a, b) => a.length > b.length ? a : b)
    }

    /**
     * attempts to split content into this.lines
     * results in number of lines <= maxLines
     */
    splitText(maxLines) {
        const words = this.content.split(" ")
        this.lines = Array(maxLines).fill("")

        const totalLength = this.content.length
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
     * gets content of a tile as a single string
     */
    getContent() {
        return this.content
    }

    /**
     * gets the value of a value tile (number)
     */
    getValue() {
        return this.value
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

        c.fillStyle = this.textColor

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
            c.roundRect(this.x, this.y, this.w, this.h, this.cornerRadii)
            c.fill()
        }

        if (!this.active)
            return

        if (this.hovering) {
            c.strokeStyle = COLORS.WHITE
            c.lineWidth = this.borderWidth
            c.stroke()
        }

        this.drawText(c)
    }
}
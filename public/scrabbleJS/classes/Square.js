class Square {
    constructor(x, y, mult, type) {
        this.x = x
        this.y = y
        this.mult = mult
        this.type = type
    }

    //gets word multiplier (1 for letter bonus squares)
    wordMult() {
        if (this.type == "letter")
            return 1
        if (this.mult == "double")
            return 2
        else
            return 3
    }

    //gets letter multiplier (1 for word bonus squares)
    letterMult() {
        if (this.type == "word")
            return 1
        if (this.mult == "double")
            return 2
        else
            return 3
    }

    draw(c) {
        c.beginPath()
        if (this.mult == "triple") {
            if (this.type == "word")
                c.fillStyle = "orange"
            else
                c.fillStyle = "mediumseagreen"
        } else {
            if (this.type == "word")
                c.fillStyle = "tomato"
            else
                c.fillStyle = "dodgerblue"
        }
        c.fillRect(this.x-TILE_SIZE/2, this.y-TILE_SIZE/2, TILE_SIZE, TILE_SIZE)
        c.font = TILE_SIZE/3 + "px Arial"
        c.fillStyle = "black"
        c.textAlign = "center"
        c.textBaseline = "bottom"
        c.fillText(this.mult, this.x, this.y)
        c.textBaseline = "top"
        c.fillText(this.type, this.x, this.y)
    }
}
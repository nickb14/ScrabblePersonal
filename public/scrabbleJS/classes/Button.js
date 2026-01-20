class Button {
    constructor(x, y, l, w, text, text2) {
        this.x = x
        this.y = y
        this.l = l
        this.w = w
        this.text = text
        this.text2 = text2
        this.hover = false
        this.active = false
    }

    //sets the hovering state of the button based on (x, y)
    hovering(x, y) {
        if (this.clicked(x, y))
            this.hover = true
        else
            this.hover = false
    }

    //returns whether (x, y) is above the button
    clicked(x, y) {
        if (x < this.x-this.l/2 || x > this.x+this.l/2 || y < this.y-this.w/2 || y > this.y+this.w/2)
            return false
        return this.active
    }

    //sets whether the button is active
    setActive(active) {
        this.active = active
    }

    draw(c) {
        c.beginPath()
        if (!this.active)
            c.fillStyle = "gray"
        else if (this.hover)
            c.fillStyle = "white"
        else
            c.fillStyle = "deeppink"
        c.fillRect(this.x-this.l/2, this.y-this.w/2, this.l, this.w)
        c.strokeRect(this.x-this.l/2, this.y-this.w/2, this.l, this.w)
        c.font = this.w/3 + "px Arial"
        c.fillStyle = "black"
        c.textAlign = "center"
        if (this.text2) {
            c.textBaseline = "bottom"
            c.fillText(this.text, this.x, this.y)
            c.textBaseline = "top"
            c.fillText(this.text2, this.x, this.y)
        } else {
            c.textBaseline = "middle"
            c.fillText(this.text, this.x, this.y)
        }
    }
}
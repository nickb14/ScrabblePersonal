/**
 * parent class for clickable items (buzzers, tiles)
 * default rectangle
 */
class Button extends DisplayItem {
    /**
     * 
     */
    constructor() {
        super()

        this.active = true
        this.hovering = false
    }

    /**
     * sets active/inactive
     */
    setActive(active) {
        this.active = active
    }

    /**
     * returns true if (x, y) within the rectangle
     */
    inBounds(x, y) {
        if (x < this.x || x > this.x+this.w || y < this.y || y > this.y+this.h)
            return false
        return true
    }

    /**
     * sets hovering
     */
    hover(x, y) {
        if (this.inBounds(x, y))
            this.hovering = true
        else
            this.hovering = false
    }

    /**
     * returns true if active and (x, y) within the rectangle
     */
    click(x, y) {
        if (!this.inBounds(x, y))
            return false
        return this.active
    }
}
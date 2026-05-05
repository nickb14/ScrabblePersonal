/**
 * cirular player buzzer
 * radius only based on width
 */
class Buzzer extends Button {
    /**
     * this.cooldown in milliseconds
     */
    constructor() {
        super()

        this.active = false

        this.cooldown = 250
        this.onCooldown = false

        this.r = 0
        this.xc = 0
        this.yc = 0
    }

    /**
     * x, y is still top left
     * w = 2*radius
     */
    resize(x, y, w) {
        super.resize(x, y, w, w)
        this.r = this.w/2
        this.xc = this.x+this.r
        this.yc = this.y+this.r
    }

    /**
     * returns true if (x, y) within the circle
     */
    inBounds(x, y) {
        if ((x-this.xc)**2 + (y-this.yc)**2 > this.r**2)
            return false
        return true
    }

    /**
     * returns true if active and (x, y) within the circle
     * sets cooldown if not already on cooldown
     */
    click(x, y) {
        if (this.onCooldown)
            return false
        if (!this.inBounds(x, y))
            return false

        this.onCooldown = true
        setTimeout(() => {
            this.onCooldown = false
        }, this.cooldown)

        if (!this.active)
            return false

        this.active = false
        return true
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        c.beginPath()

        if (this.active && !this.onCooldown)
            c.fillStyle = COLORS.GREEN
        else
            c.fillStyle = COLORS.GRAY

        c.arc(this.xc, this.yc, this.r, 0, 2*Math.PI)
        c.fill()

        if (this.active && this.hovering) {
            c.strokeStyle = COLORS.WHITE
            c.lineWidth = this.borderWidth
            c.stroke()
        }
    }
}
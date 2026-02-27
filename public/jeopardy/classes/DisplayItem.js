/**
 * parent class for all classes to be displayed
 * all start without dimension, must call resize() to set dimensions
 */
class DisplayItem {
    /**
     * x, y top left
    */
    constructor() {
        this.x = 0
        this.y = 0
        this.w = 0
        this.h = 0
    }

    /**
     * sets new dimensions
     */
    resize(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

}
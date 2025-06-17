class Score {
    constructor(id) {
        this.x = TILE_SIZE*16 + TILE_SIZE*3*id
        this.y = TILE_SIZE*3
        this.id = id
        this.name = 'Player ' + id
        this.scores = []
        this.current = 0
    }

    //sets the current turn's score
    setScore(score) {
        this.current = score
    }

    //puts the current turn's score into the list of past scores, and resets current score
    endTurn() {
        this.scores.push(this.current)
        this.current = 0
    }

    //returns the total score
    total() {
        let total = 0
        this.scores.forEach((score) => {total += score})
        return total + this.current
    }

    draw(c) {
        c.beginPath()
        c.font = TILE_SIZE*2/3 + "px Arial"
        c.fillStyle = "black"
        c.textAlign = "left"
        c.textBaseline = "middle"
        c.fillText(this.name, this.x, this.y)

        c.moveTo(this.x, this.y+TILE_SIZE/2)
        c.lineTo(this.x + c.measureText(this.name).width, this.y+TILE_SIZE/2)
        c.stroke()

        c.font = TILE_SIZE/3 + "px Arial"
        let i = 0
        for ( ; i < this.scores.length; i++)
            c.fillText(this.scores[i], this.x, this.y+TILE_SIZE*(1+i/2))
        c.fillText("(" + this.current + ")", this.x, this.y+TILE_SIZE*(1+i/2))

        c.font = TILE_SIZE*2/3 + "px Arial"
        c.moveTo(this.x, this.y+TILE_SIZE*(1.5+i/2))
        c.lineTo(this.x + c.measureText(this.name).width, this.y+TILE_SIZE*(1.5+i/2))
        c.stroke()
        c.fillText(this.total(), this.x, this.y+TILE_SIZE*(2+i/2))
    }

    toArray() {
        const array = []
        this.scores.forEach((score) => {array.push(score)})
        return array
    }

    fromArray(array) {
        this.scores.length = 0
        array.forEach((score) => {this.scores.push(score)})
    }
}
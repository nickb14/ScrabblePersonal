class Score {
    constructor(id, isPlayer) {
        this.x = TILE_SIZE*16 + TILE_SIZE*3*id
        this.y = TILE_SIZE*3
        this.id = id
        this.name = 'Player ' + id
        this.scores = []
        this.current = 0
        this.active = false
        this.isPlayer = isPlayer
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

    //sets whether it is this score's turn (based on turn)
    setActive(turn) {
        this.active = turn == this.id
    }

    //uses (turn) fyi
    draw(c) {
        c.beginPath()
        if (this.isPlayer)
            c.font = "bold " + TILE_SIZE*2/3 + "px Arial"
        else
            c.font = TILE_SIZE*2/3 + "px Arial"
        let name = this.name
        let width = c.measureText(name).width
        if (width > TILE_SIZE*3) {
            while (width > TILE_SIZE*3) {
                name = name.slice(0, -1)
                width = c.measureText(name + '...').width
            }
            name += '...'
        } else if (width < TILE_SIZE) {
            width = TILE_SIZE
        }

        if (this.active) {
            c.fillStyle = "burlywood"
            c.fillRect(this.x-TILE_SIZE/6, this.y-TILE_SIZE/2, width+TILE_SIZE/3, TILE_SIZE*(3+this.scores.length/2))
        }

        c.fillStyle = "black"
        c.textAlign = "left"
        c.textBaseline = "middle"
        c.fillText(name, this.x, this.y)

        c.moveTo(this.x, this.y+TILE_SIZE/2)
        c.lineTo(this.x + width, this.y+TILE_SIZE/2)
        c.stroke()

        c.font = TILE_SIZE/3 + "px Arial"
        let i = 0
        for ( ; i < this.scores.length; i++)
            c.fillText(this.scores[i], this.x, this.y+TILE_SIZE*(1+i/2))
        if (this.active && this.isPlayer) {
            c.fillText("(" + this.current + ")", this.x, this.y+TILE_SIZE*(1+i/2))
            i++
        }

        c.font = TILE_SIZE*2/3 + "px Arial"
        c.moveTo(this.x, this.y+TILE_SIZE*(1+i/2))
        c.lineTo(this.x + width, this.y+TILE_SIZE*(1+i/2))
        c.stroke()
        c.fillText(this.total(), this.x, this.y+TILE_SIZE*(1.5+i/2))
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
class Score {
    constructor(id, isPlayer) {
        this.x = TILE_SIZE*16 + TILE_SIZE*3*id
        this.y = TILE_SIZE*3
        this.w = TILE_SIZE*8/3
        this.id = id
        this.name = 'Player ' + id
        this.scores = []
        this.current = 0
        this.active = false
        this.isPlayer = isPlayer
        this.connected = true
        this.hover = false
        this.editing = false
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

    //sets whether this player is connected
    setConnected(connected) {
        this.connected = connected
    }

    //add character to name, or backspace/enter
    editName(char) {
        if (!this.editing)
            return

        if (char == 'Backspace')
            this.name = this.name.slice(0, -1)
        else if (char == 'Enter')
            this.editing = false
        //hidden max length 20
        else if (this.name.length < 20 && char.length == 1 && char.charCodeAt(0) >= 32)
            this.name += char
    }

    //gets player name
    getName() {
        return this.name
    }

    //sets player name
    setName(name) {
        this.name = name
    }

    //sets the hovering state of the score (button) based on (x, y)
    hovering(x, y) {
        if (this.clicked(x, y))
            this.hover = true
        else
            this.hover = false
    }

    //returns whether (x, y) is above the score (button)
    clicked(x, y) {
        let l = TILE_SIZE
        if (x < this.x-TILE_SIZE/6 || x > this.x+this.w+TILE_SIZE/6 || y < this.y-TILE_SIZE/2 || y > this.y+TILE_SIZE/2)
            return false
        return true
    }

    //toggles whether the name can currently be edited
    toggleEditing() {
        this.editing = !this.editing
    }

    //uses (turn) fyi
    draw(c, time) {
        c.beginPath()
        if (this.isPlayer)
            c.font = "bold " + TILE_SIZE*2/3 + "px Arial"
        else
            c.font = TILE_SIZE*2/3 + "px Arial"
        let name = this.name
        this.w = c.measureText(name).width
        if (this.w > TILE_SIZE*8/3) {
            while (this.w > TILE_SIZE*8/3) {
                name = name.slice(0, -1)
                this.w = c.measureText(name + '...').width
            }
            name += '...'
        } else if (this.w < TILE_SIZE) {
            this.w = TILE_SIZE
        }

        if (this.active) {
            c.fillStyle = "burlywood"
            c.fillRect(this.x-TILE_SIZE/6, this.y-TILE_SIZE/2, this.w+TILE_SIZE/3, TILE_SIZE*(3+this.scores.length/2))
        }

        if (this.connected)
            c.fillStyle = "black"
        else
            c.fillStyle = "gray"
        c.textAlign = "left"
        c.textBaseline = "middle"
        if (this.editing) {
            c.fillText(this.name, this.x, this.y)
            if (Math.trunc(time)%1000 < 500) {
                c.lineWidth = 2
                c.moveTo(this.x + c.measureText(this.name).width, this.y-TILE_SIZE/3)
                c.lineTo(this.x + c.measureText(this.name).width, this.y+TILE_SIZE/3)
                c.stroke()
            }
        } else {
            c.fillText(name, this.x, this.y)
        }

        if (this.hover) {
            c.lineWidth = 2
            c.strokeRect(this.x-TILE_SIZE/6, this.y-TILE_SIZE/2, this.w+TILE_SIZE/3, TILE_SIZE)
        }

        c.beginPath()
        c.lineWidth = 1
        c.moveTo(this.x, this.y+TILE_SIZE/2)
        c.lineTo(this.x + this.w, this.y+TILE_SIZE/2)
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
        c.lineTo(this.x + this.w, this.y+TILE_SIZE*(1+i/2))
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
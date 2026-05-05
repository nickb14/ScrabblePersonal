/**
 * score display for a single team
 */
class TeamScore extends DisplayItem {
    /**
     * 
    */
    constructor(team) {
        super()

        this.teamTile = new Tile(team, {displayBack: false})
        this.scoreTile = new Tile(0, {textColor: COLORS.GOLD, displayBack: false})
        this.players = []
    }

    /**
     * sets new dimensions
     */
    resize(x, y, w, h) {
        super.resize(x, y, w, h)
        this.teamTile.resize(x, y, w, h/2)
        this.scoreTile.resize(x, y+h*2/5, w, h/2)
    }

    /**
     * returns team name
     */
    getTeamName() {
        return this.teamTile.getContent()
    }

    /**
     * sets list of players
     */
    setPlayers(players) {
        this.players = players
    }

    /**
     * directly sets score
     */
    setScore(points) {
        this.scoreTile.setContent(points)
    }

     /**
     * adds to score (negative to subtract)
     */
    addScore(points) {
        this.setScore(this.scoreTile.getValue() + points)
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        c.beginPath()

        c.strokeStyle = COLORS.GRAY
        c.lineWidth = Math.min(this.w, this.h)/100
        c.roundRect(this.x, this.y, this.w, this.h, this.w/20)
        c.stroke()

        this.teamTile.draw(c)
        this.scoreTile.draw(c)
    }
}
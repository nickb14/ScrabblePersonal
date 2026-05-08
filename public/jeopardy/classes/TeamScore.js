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
     * sets hovering
     */
    hover(x, y) {
        this.teamTile.hover(x, y)
        this.scoreTile.hover(x, y)
    }

    /**
     * returns object: {clicked: bool, dim: [x, y, w, h]}
     *  clicked: true if click on either button
     *  dim: dimensions of where to put html element
     */
    click(x, y) {
        if (this.scoreTile.click(x, y)) {
            return {clicked: true, dim: this.scoreTile.getDimensions()}
        }
        return {clicked: false}
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
     * returns true if player is on this team
     */
    hasPlayer(player) {
        return this.players.includes(player)
    }

    /**
     * gets current score
     */
    getScore() {
        return this.scoreTile.getValue()
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
        c.lineWidth = this.borderWidth
        c.roundRect(this.x, this.y, this.w, this.h, this.cornerRadii)
        c.stroke()

        this.teamTile.draw(c)
        this.scoreTile.draw(c)
    }
}
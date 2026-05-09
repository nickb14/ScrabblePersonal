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

        this.displayPlayers = true
        this.playersTile = new Tile("", {displayBack: false})
    }

    /**
     * sets new dimensions
     */
    resize(x, y, w, h) {
        super.resize(x, y, w, h)
        if (this.displayPlayers) {
            this.teamTile.resize(x, y, w, h*0.4)
            this.scoreTile.resize(x, y+h*0.3, w, h*0.5)
        } else {
            this.teamTile.resize(x, y, w, h*0.5)
            this.scoreTile.resize(x, y+h*0.4, w, h*0.5)
        }
        this.playersTile.resize(x, y+h*0.7, w, h*0.3)
    }

    /**
     * sets hovering
     */
    hover(x, y) {
        this.teamTile.hover(x, y)
        this.scoreTile.hover(x, y)
    }

    /**
     * returns object: {clicked: string, dim: [x, y, w, h]}
     *  clicked: either "team", "score", or null
     *  dim: dimensions of where to put html element
     */
    click(x, y) {
        if (this.teamTile.click(x, y)) {
            return {clicked: "team", dim: this.teamTile.getDimensions()}
        }
        if (this.scoreTile.click(x, y)) {
            return {clicked: "score", dim: this.scoreTile.getDimensions()}
        }
        return {clicked: null}
    }

    /**
     * returns team name
     */
    getTeamName() {
        return this.teamTile.getContent()
    }

    /**
     * sets team name
     */
    setTeamName(name) {
        this.teamTile.setContent(name)
    }

    /**
     * sets list of players
     */
    setPlayers(players) {
        this.players = players
        this.playersTile.setContent(players.join(", "))
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
        if (this.displayPlayers)
            this.playersTile.draw(c)
    }
}
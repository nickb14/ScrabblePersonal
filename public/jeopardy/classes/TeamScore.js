/**
 * score display for a single team
 */
class TeamScore extends DisplayItem {
    /**
     * 
    */
    constructor(team) {
        super()

        this.teamTile = new Tile(TILES.TEXT, team, true)
        this.scoreTile = new Tile(TILES.VALUE, 0, true)
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
     * changes team name
     */
    setTeamName(team) {
        this.teamTile.setText(team)
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
        this.scoreTile.setText(points)
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

        c.fillStyle = COLORS.TILE_BACK
        c.roundRect(this.x, this.y, this.w, this.h, this.w/20)
        c.fill()

        this.teamTile.draw(c)
        this.scoreTile.draw(c)
    }
}
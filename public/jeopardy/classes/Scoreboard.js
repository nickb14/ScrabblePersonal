/**
 * display for all team scores
 */
class Scoreboard extends DisplayItem {
    /**
     * 
    */
    constructor() {
        super()

        this.teamScores = []
        this.lastClicked = null
    }

    /**
     * sets new dimensions
     */
    resize(x, y, w, h) {
        super.resize(x, y, w, h)
        
        const borderRatio = 0.03
        const tileW = w/this.teamScores.length * (1-2*borderRatio)
        const tileH = h * (1-2*borderRatio)
        let tileX = x + borderRatio*tileW
        const tileY = y + borderRatio*tileH

        for (let i = 0; i < this.teamScores.length; i++) {
            this.teamScores[i].resize(tileX, tileY, tileW, tileH)
            tileX += w/this.teamScores.length
        }
    }

    /**
     * sets hovering
     */
    hover(x, y) {
        for (let teamScore of this.teamScores)
            teamScore.hover(x, y)
    }

    /**
     * returns object: {clicked: bool, dim: [x, y, w, h], score: number}
     *  clicked: true if click on either button
     *  dim: dimensions of where to put html element
     *  score: current score
     */
    click(x, y) {
        for (let teamScore of this.teamScores) {
            const {clicked, dim} = teamScore.click(x, y)
            if (clicked) {
                this.lastClicked = teamScore
                return {clicked, dim, score: teamScore.getScore()}
            }
        }
        return {clicked: false}
    }

    /**
     * teams: {team name: [array of player names]}
     * adds new teams, removes teams no longer there,
     * does not affect team scores if the team is already present
     * updates all players
     */
    setTeams(teams) {
        const newTeams = new Set(Object.keys(teams))
        for (let i = this.teamScores.length-1; i >= 0; i--) {
            const team = this.teamScores[i].getTeamName()
            if (newTeams.delete(team))
                this.teamScores[i].setPlayers(teams[team])
            else
                this.teamScores.splice(i, 1)
        }
        for (let team of newTeams) {
            this.teamScores.push(new TeamScore(team))
            this.teamScores.at(-1).setPlayers(teams[team])
        }
        this.resize(this.x, this.y, this.w, this.h)
    }

    /**
     * adds points to team score that player is on
     */
    addScore(points, player) {
        for (let teamScore of this.teamScores) {
            if (teamScore.hasPlayer(player))
                teamScore.addScore(points)
        }
    }

    /**
     * directly sets points to team score that was last clicked
     */
    setScore(points) {
        if (this.lastClicked != null)
            this.lastClicked.setScore(points)
    }

    /**
     * draws on 2D canvas context
     */
    draw(c) {
        c.beginPath()

        for (let teamScore of this.teamScores) {
            teamScore.draw(c)
        }

    }
}
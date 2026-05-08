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
     * returns object: {clicked: string, dim: [x, y, w, h], value: string}
     *  clicked: either "team", "score", or null
     *  dim: dimensions of where to put html element
     *  value: current score or team name
     */
    click(x, y) {
        for (let teamScore of this.teamScores) {
            const {clicked, dim} = teamScore.click(x, y)
            if (clicked) {
                this.lastClicked = teamScore
                if (clicked === "team")
                    return {clicked, dim, value: teamScore.getTeamName()}
                if (clicked === "score")
                    return {clicked, dim, value: String(teamScore.getScore())}
            }
        }
        return {clicked: null}
    }

    /**
     * teams: {team name: {points: number, players: [array of player names]}}
     * adds new teams, removes teams no longer there,
     * does not affect team scores if the team is already present
     * updates all scores, updates all players
     */
    setTeams(teams) {
        const newTeams = new Set(Object.keys(teams))
        for (let i = this.teamScores.length-1; i >= 0; i--) {
            const team = this.teamScores[i].getTeamName()
            if (newTeams.delete(team)) { //existing team
                this.teamScores[i].setPlayers(teams[team].players)
                this.teamScores[i].setScore(teams[team].points)
            } else { //deleted team
                this.teamScores.splice(i, 1)
            }
        }
        for (let team of newTeams) { //new team
            this.teamScores.push(new TeamScore(team))
            this.teamScores.at(-1).setPlayers(teams[team].players)
            this.teamScores.at(-1).setScore(teams[team].points)
        }
        this.resize(this.x, this.y, this.w, this.h)
    }

    /**
     * adds points to team score that player is on
     * returns {score: number, team: string}
     */
    addScore(points, player) {
        for (let teamScore of this.teamScores) {
            if (teamScore.hasPlayer(player)) {
                teamScore.addScore(points)
                return {score: teamScore.getScore(), team: teamScore.getTeamName()}
            }
        }
        return {score: 0, team: null}
    }

    /**
     * directly sets points to team score that was last clicked
     * returns the team points were assigned to, or null
     */
    setScore(points) {
        if (this.lastClicked != null) {
            this.lastClicked.setScore(points)
            return this.lastClicked.getTeamName()
        }
        return null
    }

    /**
     * directly sets new name to team score that was last clicked
     * returns previous name or null
     */
    setTeamName(name) {
        if (this.lastClicked != null) {
            const prevName = this.lastClicked.getTeamName()
            this.lastClicked.setTeamName(name)
            return prevName
        }
        return null
    }

    /**
     * completely removes team score that was last clicked
     * returns name of deleted or null
     */
    removeTeam() {
        if (this.lastClicked != null) {
            const prevName = this.lastClicked.getTeamName()
            const i = this.teamScores.indexOf(this.lastClicked)
            if (i > -1)
                this.teamScores.splice(i, 1)
            this.resize(this.x, this.y, this.w, this.h)
            return prevName
        }
        return null
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
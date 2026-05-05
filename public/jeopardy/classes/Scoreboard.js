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
     * teams: array of team names
     * adds new teams, removes teams no longer there,
     * does not affect team scores if the team is already present
     */
    setTeams(teams) {
        const newTeams = new Set(teams)
        for (let i = this.teamScores.length-1; i >= 0; i--) {
            const team = this.teamScores[i].getTeamName()
            if (!newTeams.delete(team))
                this.teamScores.splice(i, 1)
        }
        for (let team of newTeams) {
            this.teamScores.push(new TeamScore(team))
        }
        this.resize(this.x, this.y, this.w, this.h)
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
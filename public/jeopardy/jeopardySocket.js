//all jeopardy-specific backend logic

module.exports = (io) => {

    let numPlayers = 0
    const players = {} //socket.id: player name
    const teams = {} //team name: {points: number, players: [array of player names]}
    // const buzzerQueue = []
    const hosts = [] //ids of hosts
    const cluesPlayed = []

    io.on('connection', (socket) => {
        //when display, host, or player page opened
        socket.on('joinGame', (type) => {
            //add player
            if (type === 'player') {
                numPlayers++

                //next available player name
                let name = 'Player ' + numPlayers
                for (let i = numPlayers+1; Object.values(players).includes(name); i++)
                    name = 'Player ' + i
                players[socket.id] = name

                socket.emit('setName', name)
                socket.emit('setTeams', teams)
            }
            //add host
            if (type === 'host') {
                hosts.push(socket.id)
                socket.emit('setTeams', teams)
                socket.emit('setClues', cluesPlayed)
            }
            //add display
            if (type === 'display') {
                socket.emit('setTeams', teams)
                socket.emit('setClues', cluesPlayed)
            }
        })

        //when player changes name
        socket.on('changeName', (name) => {
            //duplicate name
            prevName = players[socket.id]
            if (Object.values(players).includes(name)) {
                socket.emit('setName', prevName)
                return
            }
            players[socket.id] = name
            for (const info of Object.values(teams)) {
                const i = info.players.indexOf(prevName)
                if (i > -1)
                    info.players[i] = name
            }

            io.emit('setTeams', teams)
        })

        //when player changes teams
        socket.on('changeTeam', (team) => {
            const name = players[socket.id]
            removeFromTeams(name)

            if (Object.keys(teams).includes(team)) {
                //existing team
                teams[team].players.push(name)
            } else {
                //new team
                teams[team] = {points: 0, players: [name]}
            }
            io.emit('setTeams', teams)
        })

        //when edits a team name
        socket.on('changeTeamName', (prevTeam, newTeam) => {
            for (const player of teams[prevTeam].players)
                io.to(getSocketId(player)).emit('setTeam', newTeam)
            teams[newTeam] = teams[prevTeam]
            delete teams[prevTeam]
            io.emit('setTeams', teams)
        })

        //when host removes a team
        socket.on('removeTeam', (team) => {
            for (const player of teams[team].players)
                io.to(getSocketId(player)).emit('setTeam', "Select team...")
            delete teams[team]
            io.emit('setTeams', teams)
        })

        //when host changes the score of a team
        socket.on('setScore', (points, team) => {
            if (Object.hasOwn(teams, team))
                teams[team].points = points
            io.emit('setTeams', teams)
        })

        //when host clicks into a clue
        socket.on('playClue', (clue) => {
            if (!cluesPlayed.includes(clue)) {
                cluesPlayed.push(clue)
                io.emit('setClues', cluesPlayed)
            }
            io.emit('cluePlayed', clue)
        })

        //when resets entire game
        socket.on('resetGame', () => {
            for (const info of Object.values(teams))
                info.points = 0
            cluesPlayed.length = 0

            io.emit('setTeams', teams)
            io.emit('setClues', cluesPlayed)
        })

        //when player successfully buzzes in
        socket.on('buzz', () => {
            io.emit('buzzed', players[socket.id])
        })

        //when host sets buzzers active/deactive
        socket.on('setBuzzers', (active) => {
            io.emit('setBuzzer', active)
        })

        //when any user disconnects
        socket.on('disconnect', () => {
            //remove player
            if (Object.hasOwn(players, socket.id)) {
                removeFromTeams(players[socket.id])
                delete players[socket.id]
                numPlayers--
            }
            //remove host
            const i = hosts.indexOf(socket.id)
            if (i > -1)
                hosts.splice(i, 1)
            io.emit('setTeams', teams)
        })

        //-------------------- helper functions --------------------
        //returns id of player name
        function getSocketId(name) {
            for (const id of Object.keys(players)) {
                if (players[id] === name)
                    return id
            }
            return null
        }

        //removes name from all teams
        function removeFromTeams(name) {
            for (const info of Object.values(teams)) {
                const i = info.players.indexOf(name)
                if (i > -1)
                    info.players.splice(i, 1)
            }
        }
    })
}
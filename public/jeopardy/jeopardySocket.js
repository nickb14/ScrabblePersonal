//all jeopardy-specific backend logic

module.exports = (io) => {

    let numPlayers = 0
    const players = {} //socket.id: player name
    // let numTeams = 0
    const teams = {} //team name: [array of player names]
    // const buzzerQueue = []

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

                // numTeams++
                // teams['Team '+numTeams] = [name]

                socket.emit('setName', name)
                socket.emit('setTeams', teams)
            }
            //add host
            if (type === 'host') {
                socket.emit('setTeams', teams)
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
            for (const names of Object.values(teams)) {
                const i = names.indexOf(prevName)
                if (i > -1)
                    names[i] = name
            }

            io.emit('setTeams', teams)
        })

        //when player changes teams
        socket.on('changeTeam', (team) => {
            const name = players[socket.id]
            removeFromTeams(name)

            if (Object.keys(teams).includes(team)) {
                //existing team
                teams[team].push(name)
            } else {
                //new team
                teams[team] = [name]
            }
            io.emit('setTeams', teams)
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
        })

        //-------------------- helper functions --------------------
        //removes name from all teams
        function removeFromTeams(name) {
            for (const names of Object.values(teams)) {
                const i = names.indexOf(name)
                if (i > -1)
                    names.splice(i, 1)
            }
        }
    })
}
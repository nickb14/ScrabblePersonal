//all jeopardy-specific backend logic

module.exports = (io) => {

    let numPlayers = 0
    const players = {} //socket.id: player name
    // let numTeams = 0
    const teams = {} //team name: [array of player names]

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
                socket.emit('setTeams', Object.keys(teams))
            }

            console.log(players)
            console.log(teams)
        })

        //when player changes name
        socket.on('changeName', (name) => {
            //duplicate name
            if (Object.values(players).includes(name)) {
                socket.emit('setName', players[socket.id])
                return
            }
            //change name, including on team
            const oldName = players[socket.id]
            Object.values(teams).forEach(names => {
                const i = names.indexOf(oldName)
                if (i > -1)
                    names[i] = name
            })
            players[socket.id] = name

            console.log(players)
            console.log(teams)
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
                io.emit('setTeams', Object.keys(teams))
            }
            
            console.log(players)
            console.log(teams)
        })

        //when player successfully buzzes in
        socket.on('buzz', () => {
            
        })

        //when any user disconnects
        socket.on('disconnect', () => {
            //remove player
            if (Object.hasOwn(players, socket.id)) {
                removeFromTeams(players[socket.id])
                delete players[socket.id]
                numPlayers--
            }
            
            console.log(players)
            console.log(teams)
        })

        //helper function
        function removeFromTeams(name) {
            Object.values(teams).forEach(names => {
                const i = names.indexOf(name)
                if (i > -1)
                    names.splice(i, 1)
            })
        }
    })
}
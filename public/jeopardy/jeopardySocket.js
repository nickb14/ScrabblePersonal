//all jeopardy-specific backend logic

module.exports = (io) => {

    let numPlayers = 0
    const players = {} //socket.id: player name
    // let numTeams = 0
    const teams = {} //team name: [array of player ids]

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
            players[socket.id] = name

            console.log(players)
            console.log(teams)
        })

        //when player changes teams
        socket.on('changeTeam', (team) => {
            removeFromTeams(socket.id)

            if (Object.keys(teams).includes(team)) {
                //existing team
                teams[team].push(socket.id)
            } else {
                //new team
                teams[team] = [socket.id]
                io.emit('setTeams', Object.keys(teams))
            }
            
            console.log(players)
            console.log(teams)
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
                removeFromTeams(socket.id)
                delete players[socket.id]
                numPlayers--
            }
            
            console.log(players)
            console.log(teams)
        })

        //helper function
        function removeFromTeams(id) {
            Object.values(teams).forEach(ids => {
                const i = ids.indexOf(id)
                if (i > -1)
                    ids.splice(i, 1)
            })
        }
    })
}
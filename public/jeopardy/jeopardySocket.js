//all jeopardy-specific backend logic

module.exports = (io) => {

    let numPlayers = 0
    const players = {} //socket.id: player name
    let numTeams = 0
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
        })

        //when any user disconnects
        socket.on('disconnect', () => {
            //remove player
            if (Object.hasOwn(players, socket.id)) {
                const name = players[socket.id]
                Object.values(teams).forEach(names => {
                    const i = names.indexOf(name)
                    if (i > -1)
                        names.splice(i, 1)
                })
                delete players[socket.id]
                numPlayers--
            }
            
            console.log(players)
            console.log(teams)
        })

    })
}
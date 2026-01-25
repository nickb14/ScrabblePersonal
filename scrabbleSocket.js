//all scrabble-specific backend logic

module.exports = (io) => {

    //game objects... (backend)
    let numPlayers = 0
    let players = {}
    const disconnected = []

    let turn = 0
    let bBag = null
    let bBoard = null
    const bScoreboard = []
    const bHands = []

    let lastValid = false
    let lastTurn = -1
    let lastBag = null
    let lastBoard = null
    const lastScoreboard = []
    const lastHands = []

    const endScores = []
    let posId = -1

    io.on('connection', (socket) => {
        //reconnecting players logic
        if (disconnected.length > 0) {
            const id = disconnected[0]
            disconnected.splice(0, 1)
            players[socket.id] = id
            io.emit('reconnectPlayer', id)
            socket.emit('endTurn', turn, bBag, bBoard, bScoreboard, bHands, disconnected, lastValid)
        }
        else if (numPlayers < 4) {
            players[socket.id] = numPlayers
            numPlayers++
            turn--
            bHands.push(null)
            socket.emit('addPlayer', numPlayers, bBag, bBoard, bScoreboard)
        }
        else {
            return
        }

        socket.on('endTurn', (bagArray, boardArray, scoreboardArray, handArray, turnEnded) => {
            lastValid = turnEnded

            lastTurn = turn
            lastBag = bBag
            lastBoard = bBoard
            lastScoreboard.length = 0
            bScoreboard.forEach((score) => {lastScoreboard.push(score)})
            lastHands.length = 0
            bHands.forEach((hand) => {lastHands.push(hand)})

            turn++
            if (turn >= numPlayers)
            turn = 0
            bBag = bagArray
            bBoard = boardArray
            bScoreboard.length = 0
            scoreboardArray.forEach((score) => {bScoreboard.push(score)})
            bHands[players[socket.id]] = handArray
            io.emit('endTurn', turn, bBag, bBoard, bScoreboard, bHands, disconnected, lastValid)
        })

        socket.on('endGame', (bagArray, boardArray, scoreboardArray, handArray) => {
            lastTurn = turn
            lastBag = bBag
            lastBoard = bBoard
            lastScoreboard.length = 0
            bScoreboard.forEach((score) => {lastScoreboard.push(score)})
            lastHands.length = 0
            bHands.forEach((hand) => {lastHands.push(hand)})

            turn = -1
            bBag = bagArray
            bBoard = boardArray
            bScoreboard.length = 0
            scoreboardArray.forEach((score) => {bScoreboard.push(score)})
            bHands[players[socket.id]] = handArray

            io.emit('endScores')

            //blocking until all of the endScores (negative points) are collected
            function wait() {
            if (endScores.length < numPlayers) {
                setTimeout(wait, 100)
            } else {
                if (posId >= 0) {
                let sum = 0
                endScores.forEach((score) => {sum += score})
                bScoreboard[posId].push(sum)
                }
                io.emit('endTurn', turn, bBag, bBoard, bScoreboard, bHands, disconnected, true)
            }
            }
            wait()
        })

        socket.on('endScores', (score) => {
            const id = players[socket.id]
            endScores.push(score)
            if (score > 0)
                bScoreboard[id].push(-score)
            else
                posId = id
        })

        socket.on('backTurn', () => {
            lastValid = false
            turn = lastTurn
            bBag = lastBag
            bBoard = lastBoard
            bScoreboard.length = 0
            lastScoreboard.forEach((score) => {bScoreboard.push(score)})
            bHands.length = 0
            lastHands.forEach((hand) => {bHands.push(hand)})

            endScores.length = 0
            posId = -1
            
            io.emit('endTurn', turn, bBag, bBoard, bScoreboard, bHands, disconnected, lastValid)
        })

        socket.on('disconnect', () => {
            if (socket.id in players) {
                disconnected.push(players[socket.id])
                io.emit('disconnectPlayer', players[socket.id])
                delete players[socket.id]
            }
        })

        socket.on('resetGame', () => {
            numPlayers = 0
            players = {}
            disconnected.length = 0

            turn = 0
            bBag = null
            bBoard = null
            bScoreboard.length = 0
            bHands.length = 0

            lastValid = false
            lastTurn = -1
            lastBag = null
            lastBoard = null
            lastScoreboard.length = 0
            lastHands.length = 0

            endScores.length = 0
            posId = -1

            io.emit('resetGame')
        })

        console.log(players)
    })

}
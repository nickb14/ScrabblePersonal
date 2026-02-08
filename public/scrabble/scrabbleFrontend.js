//scrabble frontend logic, in tandem with eventListeners.js

//setting up canvas (the component everything is drawn on?)
//and context (what you call to draw stuff?)
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

//namespace
const socket = io()

canvas.width = innerWidth
canvas.height = innerHeight

//everything size-wise is based on TILE_SIZE for now...
const TILE_SIZE = canvas.height / 20

//declaring/initializing a bunch of game objects, basically...
let id = -1
let turn = 0
const bag = new Bag()
const hand = new Hand()
const board = new Board()
const reset = new Button(TILE_SIZE*9, TILE_SIZE*17, TILE_SIZE, TILE_SIZE, "reset", "turn")
const end = new Button(TILE_SIZE*11, TILE_SIZE*17, TILE_SIZE, TILE_SIZE, "end", "turn")
const exchange = new Button(TILE_SIZE*13.5, TILE_SIZE*17, TILE_SIZE*2, TILE_SIZE, "exchange", "tiles")
const challenge = new Button(TILE_SIZE*16.5, TILE_SIZE*17, TILE_SIZE*2, TILE_SIZE, "back one", "turn")
const endGame = new Button(TILE_SIZE*21, TILE_SIZE*17, TILE_SIZE, TILE_SIZE, "END", "GAME")
const resetGame = new Button(TILE_SIZE*23, TILE_SIZE*17, TILE_SIZE, TILE_SIZE, "RESET", "GAME")
const scoreboard = []

let tileGrabbed = null
const rect = canvas.getBoundingClientRect()

//when the player gets added to the game for the first time
socket.on('addPlayer', (numPlayers, bBag, bBoard, bScoreboard, bNames) => {
    id = numPlayers-1

    if (!bBag)
        bag.initializeTiles()
    else
        bag.fromArray(bBag)

    hand.returnTiles()
    hand.drawTiles(bag)

    if (bBoard)
        board.fromArray(bBoard)

    scoreboard.length = 0
    for (let i = 0; i < bScoreboard.length; i++) {
        scoreboard.push(new Score(i, false))
        scoreboard[i].setName(bNames[i])
        scoreboard[i].fromArray(bScoreboard[i])
    }
    scoreboard.push(new Score(id, true))
    socket.emit('changeName', scoreboard[id].getName())

    const scoreboardArray = []
    scoreboard.forEach((score) => {scoreboardArray.push(score.toArray())})
    socket.emit('endTurn', bag.toArray(), board.toArray(), scoreboardArray, hand.toArray(), false)
})

//when any player's turn ends
socket.on('endTurn', (bTurn, bBag, bBoard, bScoreboard, bHands, disconnected, backTurn, bNames) => {
    if (id == -1) return

    tileGrabbed = null
    
    turn = bTurn
    bag.fromArray(bBag)
    board.fromArray(bBoard)
    while (scoreboard.length < bScoreboard.length) {
        scoreboard.push(new Score(scoreboard.length, scoreboard.length == id))
        scoreboard[scoreboard.length-1].setName(bNames[scoreboard.length-1])
    }
    for (let i = 0; i < bScoreboard.length; i++) {
        scoreboard[i].fromArray(bScoreboard[i])
        scoreboard[i].setActive(turn)
    }
    hand.fromArray(bHands[id])
    hand.alignTiles()
    disconnected.forEach((bId) => {scoreboard[bId].setConnected(false)})

    reset.setActive(turn == id)
    end.setActive(turn == id)
    exchange.setActive(turn == id && bag.tilesLeft() >= 7)
    challenge.setActive(backTurn)
    endGame.setActive(turn != -1)
    resetGame.setActive(turn == -1)
})

//for negative points at the end of the game
socket.on('endScores', () => {
    if (id == -1) return

    socket.emit('endScores', hand.score())
})

socket.on('disconnectPlayer', (id) => {
    scoreboard[id].setConnected(false)
})

//directly re-adding player
socket.on('reconnectPlayer', (bId, bHand) => {
    if (id == -1)
        id = bId
    else
        scoreboard[bId].setConnected(true)
})

//to deactivate everything on game reset
socket.on('resetGame', () => {
    id = -1

    scoreboard.forEach((score) => {score.setConnected(false)})

    reset.setActive(false)
    end.setActive(false)
    exchange.setActive(false)
    challenge.setActive(false)
    endGame.setActive(false)
    resetGame.setActive(false)
})

// when someone changes their name
socket.on('changeName', (id_name, name) => {
    if (id == -1) return
    
    scoreboard[id_name].setName(name)
})

//everything here is called every frame so it "draws" frame by frame, animates...
function animate(currentTime) {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    bag.draw(ctx)
    reset.draw(ctx)
    end.draw(ctx)
    exchange.draw(ctx)
    challenge.draw(ctx)
    endGame.draw(ctx)
    resetGame.draw(ctx)
    scoreboard.forEach((score) => {score.draw(ctx, currentTime)})
    board.draw(ctx)
    hand.draw(ctx)
}

//a bunch of event listeners for mouse input, for tile grabbing and buttons... (in eventListeners.js)

animate()
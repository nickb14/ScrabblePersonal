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
const scoreboard = []

let tileGrabbed = null
const rect = canvas.getBoundingClientRect()

//when the player gets added to the game for the first time
socket.on('addPlayer', (numPlayers, bBag, bBoard, bScoreboard) => {
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
        scoreboard[i].fromArray(bScoreboard[i])
    }
    scoreboard.push(new Score(id, true))

    const scoreboardArray = []
    scoreboard.forEach((score) => {scoreboardArray.push(score.toArray())})
    socket.emit('endTurn', bag.toArray(), board.toArray(), scoreboardArray, hand.toArray(), false)
})

//when any player's turn ends
socket.on('endTurn', (bTurn, bBag, bBoard, bScoreboard, bHands, disconnected, backTurn) => {
    tileGrabbed = null
    
    turn = bTurn
    bag.fromArray(bBag)
    board.fromArray(bBoard)
    while (scoreboard.length < bScoreboard.length)
        scoreboard.push(new Score(scoreboard.length, scoreboard.length == id))
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
})

//for negative points at the end of the game
socket.on('endScores', () => {
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

//everything here is called every frame so it "draws" frame by frame, animates...
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    bag.draw(ctx)
    reset.draw(ctx)
    end.draw(ctx)
    exchange.draw(ctx)
    challenge.draw(ctx)
    scoreboard.forEach((score) => {score.draw(ctx)})
    board.draw(ctx)
    hand.draw(ctx)
}

//a bunch of event listeners for mouse input, for tile grabbing and buttons... (in eventListeners.js)
// let tileGrabbed = null
// const rect = canvas.getBoundingClientRect()

animate()
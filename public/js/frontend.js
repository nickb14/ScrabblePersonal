//setting up canvas (the component everything is drawn on?)
//and context (what you call to draw stuff?)
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

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
const scoreboard = []

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

    for (let i = 0; i < bScoreboard.length; i++) {
        scoreboard.push(new Score(i, false))
        scoreboard[i].fromArray(bScoreboard[i])
    }
    scoreboard.push(new Score(id, true))

    const scoreboardArray = []
    scoreboard.forEach((score) => {scoreboardArray.push(score.toArray())})
    socket.emit('endTurn', bag.toArray(), board.toArray(), scoreboardArray)
})

//when any player's turn ends
socket.on('endTurn', (bTurn, bBag, bBoard, bScoreboard) => {
    turn = bTurn
    bag.fromArray(bBag)
    board.fromArray(bBoard)
    if (scoreboard.length < bScoreboard.length)
        scoreboard.push(new Score(scoreboard.length, false))
    for (let i = 0; i < bScoreboard.length; i++) {
        scoreboard[i].fromArray(bScoreboard[i])
        scoreboard[i].setActive(turn)
    }

    reset.setActive(turn == id)
    end.setActive(turn == id)
    exchange.setActive(turn == id && bag.tilesLeft() >= 7)
})

//for negative points at the end of the game
socket.on('endScores', () => {
    socket.emit('endScores', id, hand.score())
})

//everything here is called every frame so it "draws" frame by frame, animates...
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    bag.draw(ctx)
    reset.draw(ctx)
    end.draw(ctx)
    exchange.draw(ctx)
    scoreboard.forEach((score) => {score.draw(ctx)})
    board.draw(ctx)
    hand.draw(ctx)
}

//a bunch of event listeners for mouse input, for tile grabbing and buttons... (in eventListeners.js)
let tileGrabbed = null
const rect = canvas.getBoundingClientRect()

animate()
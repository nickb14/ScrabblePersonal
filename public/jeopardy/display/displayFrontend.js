//frontend for display view

//html elements
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const socket = io('/jeopardy')
socket.emit('joinGame', 'display')

//get game data from json
async function loadGame() {
    const response = await fetch("/jeopardy/sample_game.json")
    const data = await response.json()
    startGame(data["game"]["single"])
}

//run game, everything that needs gameData 
function startGame(gameData) {
    //all game items
    let mouseX = 0, mouseY = 0
    const board = new Board(gameData)
    const scoreboard = new Scoreboard()
    const buzzerQueue = new BuzzerQueue({displayButtons: false})
    const exitButton = new Tile("Exit game", {textColor: COLORS.BLACK, lineLength: 1, backColor: COLORS.GRAY})

    //recalled everytime window is resized
    function resize() {
        canvas.style.width = innerWidth + "px"
        canvas.style.height = innerHeight + "px"

        canvas.width = innerWidth * devicePixelRatio
        canvas.height = innerHeight * devicePixelRatio

        //resize game items
        const w = canvas.width
        const h = canvas.height
        //assume desktop
        board.resize(w*0.05, h*0.05, w*0.7, h*0.7)
        exitButton.resize(w*0.88, h*0.05, w*0.07, h*0.1)
        buzzerQueue.resize(w*0.8, h*0.2, w*0.15, h*0.5)
        scoreboard.resize(w*0.05, h*0.8, w*0.7, h*0.15)
    }
    resize()

    //called every frame, draws!
    function animate(currentTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //hover game items (mouse)
        exitButton.hover(mouseX, mouseY)

        //draw game items
        board.draw(ctx)
        scoreboard.draw(ctx)
        buzzerQueue.draw(ctx)
        exitButton.draw(ctx)

        requestAnimationFrame(animate)
    }
    animate()

    //------------------------------ SOCKET CALLS -----------------------------

    socket.on('buzzed', (name) => {
        buzzerQueue.push(name)
    })

    socket.on('setTeams', (teams) => {
        scoreboard.setTeams(teams)
    })

    socket.on('setClues', (playedClues) => {
        board.setClues(playedClues)
    })

    socket.on('cluePlayed', (clue) => {
        board.displayClue(clue)
        buzzerQueue.clear()
    })

    socket.on('setBuzzer', (active) => {
        if (!active)
            board.displaySolution()
    })

    socket.on('returnedToBoard', () => {
        board.returnToBoard()
    })

    socket.on('playerGuessed', (player, correct) => {
        if (!correct)
            buzzerQueue.pop()
    })

    //------------------------------ EVENT LISTENERS -----------------------------

    addEventListener("resize", resize)

    canvas.addEventListener("pointerdown", (event) => {
        const x = event.offsetX * devicePixelRatio
        const y = event.offsetY * devicePixelRatio

        //click game items
        if (exitButton.click(x, y)) {
            location.href = "/jeopardy"
        }
    })

    canvas.addEventListener("pointermove", (event) => {
        if (event.pointerType === "mouse") {
            mouseX = event.offsetX * devicePixelRatio
            mouseY = event.offsetY * devicePixelRatio
        }
    })
}

loadGame()
//frontend for host view

//html elements
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const pointsInput = document.getElementById('points-input')

const socket = io()
socket.emit('joinGame', 'host')

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
    const solutions = new Solutions(gameData)
    const scoreboard = new Scoreboard()
    const buzzerQueue = new BuzzerQueue()
    const exitButton = new Tile("Exit game", {textColor: COLORS.BLACK, lineLength: 1, backColor: COLORS.GRAY})
    const resetButton = new Tile("Reset game", {textColor: COLORS.BLACK, lineLength: 1, backColor: COLORS.GRAY})

    //recalled everytime window is resized
    function resize() {
        canvas.style.width = innerWidth + "px"
        canvas.style.height = innerHeight + "px"

        canvas.width = innerWidth * devicePixelRatio
        canvas.height = innerHeight * devicePixelRatio

        //resize game items
        board.resize(50, 50, 1400, 1000)
        solutions.resize(1500, 200, 300, 200)
        scoreboard.resize(50, 1100, 1400, 250)
        buzzerQueue.resize(1500, 450, 300, 500)
        exitButton.resize(1700, 60, 100, 100)
        resetButton.resize(1590, 60, 100, 100)

        //resize html elements
        resizeHTML(pointsInput, 50, 1100, 1400, 250)
    }
    resize()

    //called every frame, draws!
    function animate(currentTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //hover game items (mouse)
        board.hover(mouseX, mouseY)
        solutions.hover(mouseX, mouseY)
        buzzerQueue.hover(mouseX, mouseY)
        exitButton.hover(mouseX, mouseY)
        resetButton.hover(mouseX, mouseY)
        scoreboard.hover(mouseX, mouseY)

        //draw game items
        board.draw(ctx)
        solutions.draw(ctx)
        scoreboard.draw(ctx)
        buzzerQueue.draw(ctx)
        exitButton.draw(ctx)
        resetButton.draw(ctx)

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

    //------------------------------ EVENT LISTENERS -----------------------------

    addEventListener("resize", resize)

    canvas.addEventListener("pointerdown", (event) => {
        const x = event.offsetX * devicePixelRatio
        const y = event.offsetY * devicePixelRatio

        //click game items
        let {clicked: boardClicked, index} = board.click(x, y)
        const {clicked: queueClicked, correct, player} = buzzerQueue.click(x, y)
        solutions.click(x, y)
        const exitClicked = exitButton.click(x, y)
        const {clicked: scoreClicked, dim, score} = scoreboard.click(x, y)

        //handle clicks...
        if (boardClicked) {
            if (index > -1)
                buzzerQueue.clear()
            socket.emit('setBuzzers', index > -1)
        }
        if (queueClicked) {
            const points = board.getValue()
            if (correct) {
                scoreboard.addScore(points, player)
                board.returnToBoard()
                index = -1
            } else {
                scoreboard.addScore(-points, player)
            }
        }
        solutions.setCurrentSolution(index)
        if (exitClicked) {
            location.href = "/jeopardy"
        }

        if (scoreClicked) {
            promptPoints(dim, score)
        } else {
            unprompt()
        }
    })

    canvas.addEventListener("pointermove", (event) => {
        if (event.pointerType === "mouse") {
            mouseX = event.offsetX * devicePixelRatio
            mouseY = event.offsetY * devicePixelRatio
        }
    })

    //------------------------------ INPUT/SELECT FUNCTIONS -----------------------------

    function resizeHTML(element, x, y, w, h) {
        element.style.left = x / devicePixelRatio + "px"
        element.style.top = y / devicePixelRatio + "px"
        element.style.width = w / devicePixelRatio + "px"
        element.style.height = h / devicePixelRatio + "px"
    }

    //points input event listener function
    function onKeydown(event) {
        if (event.key === "Enter") {
            const points = pointsInput.valueAsNumber
            if (!isNaN(points)) {
                scoreboard.setScore(points)
                //PROBABLY EMIT POINTS EVENTUALLY
            }
            pointsInput.style.display = "none"
            pointsInput.removeEventListener("keydown", onKeydown)
        }
    }

    //activates the points input html element with dimensions
    function promptPoints(dim, score) {
        pointsInput.style.display = "block"
        const [x, y, w, h] = dim
        resizeHTML(pointsInput, x, y, w, h)
        pointsInput.value = score

        setTimeout(() => pointsInput.focus(), 0) //needs to fully render before focus
        pointsInput.addEventListener("keydown", onKeydown)
    }

    //hide all input/select, remove event listeners, reactivate buttons
    function unprompt() {
        pointsInput.style.display = "none"
        pointsInput.removeEventListener("keydown", onKeydown)
    }
}

loadGame()
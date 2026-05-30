//frontend for host view

//html elements
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const pointsInput = document.getElementById('points-input')
const teamInput = document.getElementById('team-input')
const removeButton = document.getElementById('remove-button')

const socket = io('/jeopardy')
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
    const solutions = new TilesDisplay(gameData)
    const scoreboard = new Scoreboard()
    const buzzerQueue = new BuzzerQueue()
    const exitButton = new Tile("Exit game", {textColor: COLORS.BLACK, lineLength: 1, backColor: COLORS.GRAY})
    const resetButton = new Tile("Reset game", {textColor: COLORS.BLACK, lineLength: 1, backColor: COLORS.GRAY})
    const contexts = new TilesDisplay(gameData, {type: "context", defaultStr: "-  Context  -"})

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
        board.resize(w*0.05, h*0.05, w*0.6, h*0.7)
        scoreboard.resize(w*0.05, h*0.8, w*0.6, h*0.15)
        contexts.resize(w*0.68, h*0.05, w*0.15, h*0.17)
        buzzerQueue.resize(w*0.68, h*0.25, w*0.15, h*0.5)
        solutions.resize(w*0.68, h*0.78, w*0.15, h*0.17)
        exitButton.resize(w*0.86, h*0.05, w*0.07, h*0.1)
        resetButton.resize(w*0.86, h*0.17, w*0.07, h*0.1)
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
        contexts.draw(ctx)

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
        solutions.setCurrentIndex(clue)
        contexts.setCurrentIndex(clue)
        buzzerQueue.clear()
    })

    socket.on('setBuzzer', (active) => {
        if (!active) {
            board.displaySolution()
            solutions.setCurrentIndex(-1)
            contexts.setCurrentIndex(-1)
        }
    })

    socket.on('returnedToBoard', () => {
        board.returnToBoard()
    })

    socket.on('playerGuessed', (player, correct) => {
        if (!correct && player === buzzerQueue.peek())
            buzzerQueue.pop()
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
        const resetClicked = resetButton.click(x, y)
        const {clicked: scoreClicked, dim, value} = scoreboard.click(x, y)

        //handle clicks...
        if (boardClicked) {
            if (index > -1) {
                socket.emit('playClue', index)
                socket.emit('setBuzzers', true)
            } else if (index === -2) {
                socket.emit('setBuzzers', false)
            } else {
                socket.emit('returnToBoard')
            }
        }
        if (queueClicked) {
            const points = board.getValue()
            if (correct) {
                const {score, team} = scoreboard.addScore(points, player)
                socket.emit('setScore', score, team)
                socket.emit('setBuzzers', false)
            } else {
                const {score, team} = scoreboard.addScore(-points, player)
                socket.emit('setScore', score, team)
            }
            socket.emit('playerGuess', player, correct)
        }

        if (exitClicked) {
            location.href = "/jeopardy"
        }
        if (resetClicked) {
            socket.emit('resetGame')
        }

        unprompt()
        if (scoreClicked === "team") {
            promptTeam(dim, value)
        } else if (scoreClicked === "score") {
            promptScore(dim, value)
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
    function onPointsKeydown(event) {
        if (event.key === "Enter") {
            const points = pointsInput.valueAsNumber
            if (!isNaN(points)) {
                const team = scoreboard.setScore(points)
                socket.emit('setScore', points, team)
            }
            unprompt()
        }
    }

    //team input event listener function
    function onTeamKeydown(event) {
        if (event.key === "Enter") {
            const name = teamInput.value
            const prevName = scoreboard.setTeamName(name)
            socket.emit("changeTeamName", prevName, name)
            unprompt()
        }
    }

    //team input event listener function
    function onRemoveClick() {
        const name = scoreboard.removeTeam()
        socket.emit("removeTeam", name)
        unprompt()
    }

    //activates the points input html element with dimensions and current score
    function promptScore(dim, score) {
        pointsInput.style.display = "block"
        const [x, y, w, h] = dim
        resizeHTML(pointsInput, x, y, w*0.95, h)
        pointsInput.value = score

        setTimeout(() => pointsInput.focus(), 0)
        pointsInput.addEventListener("keydown", onPointsKeydown)
    }

    //activates the team div html element with dimensions and current name
    function promptTeam(dim, name) {
        teamInput.style.display = "block"
        removeButton.style.display = "block"
        const [x, y, w, h] = dim
        resizeHTML(teamInput, x, y, w*0.7, h)
        resizeHTML(removeButton, x+w*0.75, y, Math.max(w*0.25, 130), h)

        teamInput.value = name

        setTimeout(() => teamInput.focus(), 0)
        teamInput.addEventListener("keydown", onTeamKeydown)
        removeButton.addEventListener("click", onRemoveClick)

    }

    //hide all input/select, remove event listeners
    function unprompt() {
        pointsInput.style.display = "none"
        pointsInput.removeEventListener("keydown", onPointsKeydown)

        teamInput.style.display = "none"
        removeButton.style.display = "none"
        teamInput.removeEventListener("keydown", onTeamKeydown)
        removeButton.removeEventListener("click", onRemoveClick)
    }
}

loadGame()
//frontend for host view

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const socket = io()

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
    const teamScore = new TeamScore("test 1")
    const buzzerQueue = new BuzzerQueue()
    buzzerQueue.push("name 1")
    buzzerQueue.push("name 2")
    buzzerQueue.push("name 3")
    buzzerQueue.pop()
    buzzerQueue.push("name 4")
    buzzerQueue.push("name 5")
    buzzerQueue.push("name 6")
    buzzerQueue.push("name 7")

    //recalled everytime window is resized
    function resize() {
        canvas.style.width = innerWidth + "px"
        canvas.style.height = innerHeight + "px"

        canvas.width = innerWidth * devicePixelRatio
        canvas.height = innerHeight * devicePixelRatio

        //resize game items
        board.resize(50, 50, 1400, 1000)
        solutions.resize(1500, 50, 300, 200)
        teamScore.resize(50, 1100, 300, 250)
        buzzerQueue.resize(1500, 300, 300, 500)
    }
    resize()

    //called every frame, draws!
    function animate(currentTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = COLORS.VALUE_TEXT

        //hover game items (mouse)
        board.hover(mouseX, mouseY)
        solutions.hover(mouseX, mouseY)

        //draw game items
        board.draw(ctx)
        solutions.draw(ctx)
        teamScore.draw(ctx)
        buzzerQueue.draw(ctx)

        requestAnimationFrame(animate)
    }
    animate()

    //------------------------------ EVENT LISTENERS -----------------------------

    addEventListener("resize", resize)

    canvas.addEventListener("pointerdown", (event) => {
        const x = event.offsetX * devicePixelRatio
        const y = event.offsetY * devicePixelRatio

        //click game items
        const {clicked, index} = board.click(x, y)
        solutions.click(x, y)

        if (clicked)
            socket.emit('setBuzzers', index > -1)
        solutions.setCurrentSolution(index)
    })

    canvas.addEventListener("pointermove", (event) => {
        if (event.pointerType === "mouse") {
            mouseX = event.offsetX * devicePixelRatio
            mouseY = event.offsetY * devicePixelRatio
        }
    })
}

loadGame()
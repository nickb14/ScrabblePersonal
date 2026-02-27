//frontend for display view

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
    // const board = new Board(width/10)
    const tile = new Tile(TILES.VALUE, 400)

    //recalled everytime window is resized
    function resize() {
        canvas.style.width = innerWidth + "px"
        canvas.style.height = innerHeight + "px"

        canvas.width = innerWidth * devicePixelRatio
        canvas.height = innerHeight * devicePixelRatio

        tile.resize(50, 50, canvas.width/10, canvas.height/10)
    }
    resize()
    window.addEventListener("resize", resize)

    //called every frame, draws!
    function animate(currentTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = COLORS.VALUE_TEXT

        tile.draw(ctx)

        requestAnimationFrame(animate)
    }
    animate()
}

loadGame()
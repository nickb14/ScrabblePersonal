//frontend for display view

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const nameInput = document.getElementById('name-input')

const socket = io()
socket.emit('joinGame', 'player')

//all game items
const buzzer = new Buzzer()
const nameButton = new Tile(TILES.TEXT, "")

//recalled everytime window is resized
function resize() {
    canvas.style.width = innerWidth + "px"
    canvas.style.height = innerHeight + "px"

    canvas.width = innerWidth * devicePixelRatio
    canvas.height = innerHeight * devicePixelRatio

    //resize game items
    buzzer.resize(50, 50, canvas.width*5/10)
    nameButton.resize(50, 1000, canvas.width*20/100, canvas.height*5/100)

    //resize inputs
    resizeInput(nameInput, 50, 1100, canvas.width*20/100, canvas.height*5/100)
}
resize()

//called every frame, draws!
function animate(currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = COLORS.VALUE_TEXT

    //draw game items
    buzzer.draw(ctx)
    nameButton.draw(ctx)

    requestAnimationFrame(animate)
}
animate()

//------------------------------ TEXT INPUT FUNCTIONS -----------------------------

function resizeInput(input, x, y, w, h) {
    input.style.left = x / devicePixelRatio + "px"
    input.style.top = y / devicePixelRatio + "px"
    input.style.width = w / devicePixelRatio + "px"
    input.style.height = h / devicePixelRatio + "px"
}

function promptInput(input) {
    input.style.display = "block"
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const name = input.value
            nameButton.setText(name)
            socket.emit('changeName', name)
            input.style.display = "none"
        }
    })
}

//------------------------------ SOCKET CALLS -----------------------------

socket.on('setName', (name) => {
    nameButton.setText(name)
})

//------------------------------ EVENT LISTENERS -----------------------------

addEventListener("resize", resize)

canvas.addEventListener("pointerdown", (event) => {
    const x = event.offsetX * devicePixelRatio
    const y = event.offsetY * devicePixelRatio

    //click game items
    buzzer.click(x, y)

    if (nameButton.click(x, y))
        promptInput(nameInput)
})

canvas.addEventListener("mousemove", (event) => {
    const x = event.offsetX * devicePixelRatio
    const y = event.offsetY * devicePixelRatio

    //hover game items (mouse)
    buzzer.hover(x, y)
    nameButton.hover(x, y)
})
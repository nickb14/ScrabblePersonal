//frontend for display view

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const socket = io()

//recalled everytime window is resized
function resize() {
    canvas.style.width = innerWidth + "px"
    canvas.style.height = innerHeight + "px"

    canvas.width = innerWidth * devicePixelRatio
    canvas.height = innerHeight * devicePixelRatio
}

resize()
window.addEventListener("resize", resize)

//called every frame, draws!
function animate(currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = COLORS.VALUE_TEXT
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const tile = new Tile(TILES.VALUE, 50, 50, canvas.width/10, canvas.height/10, 400)
    tile.draw(ctx)

    requestAnimationFrame(animate)
}

animate()
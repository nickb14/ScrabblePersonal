//frontend for display view

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const socket = io()

//all game items
//

//recalled everytime window is resized
function resize() {
    canvas.style.width = innerWidth + "px"
    canvas.style.height = innerHeight + "px"

    canvas.width = innerWidth * devicePixelRatio
    canvas.height = innerHeight * devicePixelRatio

    //resize game items
    //
}
resize()

//called every frame, draws!
function animate(currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = COLORS.VALUE_TEXT

    //draw game items
    //

    requestAnimationFrame(animate)
}
animate()

//------------------------------ EVENT LISTENERS -----------------------------

addEventListener("resize", resize)

addEventListener("pointerdown", (event) => {
    console.log(event.pointerType)
})
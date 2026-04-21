//frontend for player view

//html elements
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const nameInput = document.getElementById('name-input')
const teamSelect = document.getElementById('team-select')
const teamInput = document.getElementById('team-input')

const socket = io()
socket.emit('joinGame', 'player')

//all game items
const buzzer = new Buzzer()
const nameButton = new Tile(TILES.TEXT, "Enter name...")
const teamButton = new Tile(TILES.TEXT, "Select team...")
let teams = []

//recalled everytime window is resized
function resize() {
    canvas.style.width = innerWidth + "px"
    canvas.style.height = innerHeight + "px"

    canvas.width = innerWidth * devicePixelRatio
    canvas.height = innerHeight * devicePixelRatio

    //resize game items
    buzzer.resize(50, 50, 1000)
    nameButton.resize(100, 1100, 400, 100)
    teamButton.resize(600, 1100, 400, 100)

    //resize html elements
    resizeHTML(nameInput, 100, 1100, 400, 100)
    resizeHTML(teamSelect, 600, 1100, 400, 100)
    resizeHTML(teamInput, 600, 1100, 400, 100)
}
resize()

//called every frame, draws!
function animate(currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = COLORS.VALUE_TEXT

    //draw game items
    buzzer.draw(ctx)
    nameButton.draw(ctx)
    teamButton.draw(ctx)

    requestAnimationFrame(animate)
}
animate()

//------------------------------ SOCKET CALLS -----------------------------

socket.on('setName', (name) => {
    nameButton.setText(name)
})

socket.on('setTeam', (team) => {
    teamButton.setText(team)
})

socket.on('setTeams', (newTeams) => {
    teams = newTeams
})

socket.on('setBuzzer', (active) => {
    buzzer.setActive(active)
})

//------------------------------ EVENT LISTENERS -----------------------------

addEventListener("resize", resize)

canvas.addEventListener("pointerdown", (event) => {
    const x = event.offsetX * devicePixelRatio
    const y = event.offsetY * devicePixelRatio

    //click game items
    if (buzzer.click(x, y))
        socket.emit('buzz')
    if (nameButton.click(x, y))
        promptName()
    else if (teamButton.click(x, y))
        promptTeam()
    else
        unprompt()
})

canvas.addEventListener("mousemove", (event) => {
    const x = event.offsetX * devicePixelRatio
    const y = event.offsetY * devicePixelRatio

    //hover game items (mouse)
    buzzer.hover(x, y)
    nameButton.hover(x, y)
    teamButton.hover(x, y)
})

//------------------------------ INPUT/SELECT FUNCTIONS -----------------------------

function resizeHTML(element, x, y, w, h) {
    element.style.left = x / devicePixelRatio + "px"
    element.style.top = y / devicePixelRatio + "px"
    element.style.width = w / devicePixelRatio + "px"
    element.style.height = h / devicePixelRatio + "px"
}

//activates the name input html element
function promptName() {
    nameButton.setActive(false)
    
    nameInput.style.display = "block"

    function onKeydown(event) {
        if (event.key === "Enter") {
            const name = nameInput.value.trim()
            if (name.length !== 0) {
                nameButton.setText(name)
                socket.emit('changeName', name)
            }
            nameInput.style.display = "none"
            nameButton.setActive(true)
            nameInput.removeEventListener("keydown", onKeydown)
        }
    }
    nameInput.addEventListener("keydown", onKeydown)
}

//activates the name input html element
function promptTeam() {
    teamButton.setActive(false)

    //repopulate teamSelect
    teamSelect.innerHTML = ''
    const placeholder = document.createElement("option")
    placeholder.value = ""
    placeholder.textContent = "Select team..."
    placeholder.disabled = true
    placeholder.selected = true
    teamSelect.appendChild(placeholder)
    for (const team of teams) {
        const option = document.createElement('option')
        option.value = team
        option.textContent = team
        teamSelect.appendChild(option)
    }
    const newTeam = document.createElement('option')
    newTeam.value = 'new-team'
    newTeam.textContent = 'New team...'
    teamSelect.appendChild(newTeam)

    teamSelect.style.display = "block"

    //detect selection
    function onChange() {
        if (teamSelect.value === 'new-team') {
            //detect input for new team
            teamInput.style.display = "block"
            function onKeydown(event) {
                if (event.key === "Enter") {
                    const team = teamInput.value
                    if (team.length !== 0) {
                        teamButton.setText(team)
                        socket.emit('changeTeam', team)
                    }
                    teamInput.style.display = "none"
                    teamButton.setActive(true)
                    teamInput.removeEventListener("keydown", onKeydown)
                }
            }
            teamInput.addEventListener("keydown", onKeydown)
        }
        else {
            const team = teamSelect.value
            teamButton.setText(team)
            socket.emit('changeTeam', team)
            teamButton.setActive(true)
        }
        teamSelect.style.display = "none"
        teamSelect.removeEventListener("change", onChange)
    }
    teamSelect.addEventListener("change", onChange)
}

//hide all input/select, remove event listeners, reactivate buttons
function unprompt() {
    nameButton.setActive(true)
    teamButton.setActive(true)

    nameInput.style.display = "none"
    teamSelect.style.display = "none"
    teamInput.style.display = "none"
    
    nameInput.removeEventListener("keydown", onKeydown)
    teamSelect.removeEventListener("change", onChange)
    teamInput.removeEventListener("keydown", onKeydown)
}
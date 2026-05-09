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
const nameButton = new Tile("Enter name...")
const teamButton = new Tile("Select team...")
const exitButton = new Tile("Exit game", {textColor: COLORS.BLACK, lineLength: 1, backColor: COLORS.GRAY})
let teams = []
let mouseX = 0, mouseY = 0

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
    exitButton.resize(940, 60, 100, 100)

    //resize html elements
    resizeHTML(nameInput, 100, 1100, 400, 100)
    resizeHTML(teamSelect, 600, 1100, 400, 100)
    resizeHTML(teamInput, 600, 1100, 400, 100)
}
resize()

//called every frame, draws!
function animate(currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //hover game items (mouse)
    buzzer.hover(mouseX, mouseY)
    nameButton.hover(mouseX, mouseY)
    teamButton.hover(mouseX, mouseY)
    exitButton.hover(mouseX, mouseY)

    //draw game items
    buzzer.draw(ctx)
    nameButton.draw(ctx)
    teamButton.draw(ctx)
    exitButton.draw(ctx)

    requestAnimationFrame(animate)
}
animate()

//------------------------------ SOCKET CALLS -----------------------------

socket.on('setName', (name) => {
    nameButton.setContent(name)
})

socket.on('setTeam', (team) => {
    teamButton.setContent(team)
})

socket.on('setTeams', (newTeams) => {
    teams = Object.keys(newTeams)
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
    if (exitButton.click(x, y))
        location.href = "/jeopardy"
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

//name input event listener function
function onNameKeydown(event) {
        if (event.key === "Enter") {
            const name = nameInput.value.trim()
            if (name.length !== 0) {
                nameButton.setContent(name)
                socket.emit('changeName', name)
            }
            nameInput.style.display = "none"
            nameInput.removeEventListener("keydown", onNameKeydown)
        }
    }

//name input event listener function
function onTeamKeydown(event) {
    if (event.key === "Enter") {
        const team = teamInput.value
        if (team.length !== 0) {
            teamButton.setContent(team)
            socket.emit('changeTeam', team)
        }
        teamInput.style.display = "none"
        teamInput.removeEventListener("keydown", onTeamKeydown)
    }
}

//name select event listener function
function onTeamChange() {
    if (teamSelect.value === 'new-team') {
        //detect input for new team
        teamInput.style.display = "block"
        setTimeout(() => teamInput.focus(), 0)
        teamInput.addEventListener("keydown", onTeamKeydown)
    }
    else {
        const team = teamSelect.value
        teamButton.setContent(team)
        socket.emit('changeTeam', team)
    }
    teamSelect.style.display = "none"
    teamSelect.removeEventListener("change", onTeamChange)
}

//activates the name input html element
function promptName() {
    nameInput.style.display = "block"
    setTimeout(() => nameInput.focus(), 0)
    nameInput.addEventListener("keydown", onNameKeydown)
}

//activates the name input html element
function promptTeam() {
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
    setTimeout(() => teamSelect.focus(), 0)
    teamSelect.addEventListener("change", onTeamChange)
}

//hide all input/select, remove event listeners
function unprompt() {
    nameInput.style.display = "none"
    teamSelect.style.display = "none"
    teamInput.style.display = "none"
    
    nameInput.removeEventListener("keydown", onNameKeydown)
    teamSelect.removeEventListener("change", onTeamChange)
    teamInput.removeEventListener("keydown", onTeamKeydown)
}
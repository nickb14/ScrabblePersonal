//setup things...
const express = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)
const io = new Server(server)

//just the port number
const port = 8080

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})





//game objects... (backend)
let numPlayers = 0
let turn = 0
let bBag = null
let bBoard = null
const bScoreboard = []
const endScores = []
let posId = -1

io.on('connection', (socket) => {
  if (numPlayers == 4) return
  

  numPlayers++
  turn--
  socket.emit('addPlayer', numPlayers, bBag, bBoard, bScoreboard)

  socket.on('endTurn', (bagArray, boardArray, scoreboardArray) => {
    turn++
    if (turn >= numPlayers)
      turn = 0
    bBag = bagArray
    bBoard = boardArray
    bScoreboard.length = 0
    scoreboardArray.forEach((score) => {bScoreboard.push(score)})
    io.emit('endTurn', turn, bBag, bBoard, bScoreboard)
  })

  socket.on('endGame', (bagArray, boardArray, scoreboardArray) => {
    turn = -1
    bBag = bagArray
    bBoard = boardArray
    bScoreboard.length = 0
    scoreboardArray.forEach((score) => {bScoreboard.push(score)})

    io.emit('endScores')

    //blocking until all of the endScores (negative points) are collected
    function wait() {
      if (endScores.length < numPlayers) {
        setTimeout(wait, 100)
      } else {
        if (posId >= 0) {
          let sum = 0
          endScores.forEach((score) => {sum += score})
          bScoreboard[posId].push(sum)
        }
        io.emit('endTurn', turn, bBag, bBoard, bScoreboard)
      }
    }
    wait()
  })

  socket.on('endScores', (id, score) => {
    endScores.push(score)
    if (score > 0)
      bScoreboard[id].push(-score)
    else
      posId = id
  })

  console.log(numPlayers)
})




server.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
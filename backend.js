//launch this with the command 'node backend.js'

//setup things...
const express = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)
const io = new Server(server)

//just the port number
const port = process.env.PORT || 8080

app.use(express.static('public'))



//-----------SCRABBLE----------

//the /scrabblepage url sends user to the html file :)
app.get('/scrabblepage', (req, res) => {
  res.sendFile(__dirname + '/public/scrabble/scrabblepage.html')
})

require('./public/scrabble/scrabbleSocket')(io)



//-----------JEOPARDY----------

app.get('/jeopardy', (req, res) => {
  res.sendFile(__dirname + '/public/jeopardy/jeopardylanding.html')
})

app.get('/jeopardy/display', (req, res) => {
  res.sendFile(__dirname + '/public/jeopardy/display/display.html')
})

app.get('/jeopardy/player', (req, res) => {
  res.sendFile(__dirname + '/public/jeopardy/player/player.html')
})

require('./public/jeopardy/jeopardySocket')(io)


server.listen(port, '0.0.0.0', () => {
  console.log(`ScrabblePersonal listening on port ${port}`)
})
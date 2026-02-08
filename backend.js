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
  res.sendFile(__dirname + '/public/scrabblepage.html')
})

require('./scrabbleSocket')(io)



//-----------JEOPARDY----------

app.get('/jeopardylanding', (req, res) => {
  res.sendFile(__dirname + '/public/jeopardylanding.html')
})



server.listen(port, '0.0.0.0', () => {
  console.log(`ScrabblePersonal listening on port ${port}`)
})
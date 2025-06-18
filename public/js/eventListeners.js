//mousedown select tile
addEventListener('mousedown', (event) => {
  tileGrabbed = hand.grabTile(event.clientX-rect.left, event.clientY-rect.top)
  if (!tileGrabbed)
    tileGrabbed = board.grabTile(event.clientX-rect.left, event.clientY-rect.top, hand)
})

//mousemove drag tile, and hover buttons
addEventListener('mousemove', (event) => {
  if (tileGrabbed) {
    hand.alignTiles()
    tileGrabbed.move(event.clientX-rect.left, event.clientY-rect.top)
  }
  reset.hovering(event.clientX-rect.left, event.clientY-rect.top)
  end.hovering(event.clientX-rect.left, event.clientY-rect.top)
  exchange.hovering(event.clientX-rect.left, event.clientY-rect.top)
})

//mouseup release tile
addEventListener('mouseup', (event) => {
  if (tileGrabbed) {
    if (turn == id)
      board.placeTile(event.clientX-rect.left, event.clientY-rect.top, tileGrabbed, hand)
    scoreboard[id].setScore(board.score())
    tileGrabbed = null
  }
  scoreboard[id].setScore(board.score())
  hand.alignTiles()
})

//click buttons
addEventListener('click', (event) => {
  if (reset.clicked(event.clientX-rect.left, event.clientY-rect.top)) {
    hand.reset()
    board.reset(hand)
    hand.alignTiles()
    scoreboard[id].setScore(0)
  }
  if (end.clicked(event.clientX-rect.left, event.clientY-rect.top)) {
    hand.drawTiles(bag)
    board.endTurn()
    hand.alignTiles()
    scoreboard[id].endTurn()

    const scoreboardArray = []
    scoreboard.forEach((score) => {scoreboardArray.push(score.toArray())})

    if (hand.emptyTiles() < 7)
      socket.emit('endTurn', bag.toArray(), board.toArray(), scoreboardArray)
    else
      socket.emit('endGame', bag.toArray(), board.toArray(), scoreboardArray)
  }
  if (exchange.clicked(event.clientX-rect.left, event.clientY-rect.top)) {
    hand.reset()
    board.reset(hand)
    const tiles = hand.returnTiles()
    hand.drawTiles(bag)
    bag.returnTiles(tiles)
    hand.alignTiles()
    scoreboard[id].setScore(0)
    scoreboard[id].endTurn()

    const scoreboardArray = []
    scoreboard.forEach((score) => {scoreboardArray.push(score.toArray())})
    socket.emit('endTurn', bag.toArray(), board.toArray(), scoreboardArray)
  }
  end.setActive(turn == id && board.valid())
})
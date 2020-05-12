module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    //by "name" to "room"
    // const nsp = io.of()
    socket.on('updating code', (code) => {
      console.log('updated code', code)
      io.sockets.emit('updating code', code)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

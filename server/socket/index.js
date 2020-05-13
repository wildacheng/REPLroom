module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('connectToRoom', (data) => {
      console.log(data, 'CONNECTED TO ROOM')
      socket.join(data.roomName)
      io.sockets.in(data.roomName).emit('user joined room', data.name)
      console.log('EMITTED')
    })

    socket.on('updating code', (code) => {
      console.log('updated code', code)
      io.sockets.emit('updating code', code)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

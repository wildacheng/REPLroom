module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('join-room', (room) => {
      socket.join(room)
    })

    socket.on('send-chat-message', (data) => {
      socket.to(data.roomId).emit('chat-message', data.message)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

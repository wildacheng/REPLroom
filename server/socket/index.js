module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    // let rooms = [1,2,3,4,5]
    socket.on('send-chat-message', (message) => {
      // for(let room of rooms) {
      //   if(room === this.props.match.params.roomId)
      //   console.log('room', room, 'current room', this.props.match.params.roomId)
      socket.broadcast.emit('chat-message', message)
      // }
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

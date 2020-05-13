module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    //CREATED ROOM (FROM HOMEPAGE, JOIN ROOM AND BROADCAST TO ROOM THAT THEY JOINED WITH THE NAME OF ROOM AND NAME OF PERSON)
    socket.on('created room', (data) => {
      console.log('CREATED ROOM DATA:', data)
      socket.join(data.roomName)
      io.to(`${data.roomName}`).emit('joined room', data)
    })

    //JOINED PREEXISTING ROOM (FROM HOMEPAGE), JOIN ROOM AND BROADCAST TO ROOM THAT THEY JOINED WITH THE NAME OF ROOM AND NAME OF PERSON)
    socket.on('joined room', (data) => {
      console.log('JOINED ROOM DATA:', data)
      socket.join(data.roomName)
      io.to(`${data.roomName}`).emit('joined room', data)
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

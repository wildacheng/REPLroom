module.exports = (io) => {
  const users = {}

  //dummy DB storage
  const db = {
    sampleRoomId: {
      sampleCode: '',
      sampleCollaborators: [{sampleSocketId: 2, sampleName: ''}],
    },
  }

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('fetch code from server', (data) => {
      if (!db[data.roomId]) {
        //fill in with required fields later
        db[data.roomId] = {code: data.code}
      } else {
        db[data.roomId].code = data.code
      }
      io.sockets.in(data.roomId).emit('code from server', db[data.roomId])
    })

    socket.on('updating code', (data) => {
      console.log('updated code', data)
      db[data.roomId].code = data.code
      io.sockets.in(data.roomId).emit('code from server', db[data.roomId])
    })

    socket.on('new-user-joined', (name) => {
      users[socket.id] = name
      // socket.broadcast.emit('user-connected', name)
    })

    socket.on('send-chat-message', (data) => {
      socket
        .to(data.roomId)
        .emit('chat-message', {message: data.message, name: users[socket.id]})
    })

    socket.on('connectToRoom', (data) => {
      console.log(data, 'CONNECTED TO ROOM')
      socket.join(data.roomName)
      io.sockets.in(data.roomName).emit('load users and code')
      if (data.name) {
        io.sockets.in(data.roomName).emit('user joined room', data.name)
      }
      console.log('EMITTED')
    })

    socket.on('leave room', (data) => {
      io.sockets.in(data.roomName).emit('user left room', {user: data.user})
      socket.leave(data.room)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

module.exports = (io) => {
  const users = {}

  //dummy DB storage
  const db = {
    // sampleRoomId: {
    //   sampleCode: '',
    //   sampleCollaborators: [{sampleSocketId: 'username'}],
    // },
  }

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('connectToRoom', (data) => {
      socket.join(data.roomName)
      io.sockets.in(data.roomName).emit('load users and code')
      if (data.name) {
        io.sockets.in(data.roomName).emit('user joined room', data.name)
      }
      console.log('EMITTED')
    })

    socket.on('join room', (data) => {
      socket.join(data.roomId)
      if (db[data.roomId] === undefined) {
        db[data.roomId] = {code: '// your code here\n', collaborators: []} //will update with properties as needed
      }
      const collaborators = db[data.roomId].collaborators
      collaborators[socket.id] = data.username
      console.log(db)

      io.in(data.roomId).emit(
        'code and collaborators from server',
        db[data.roomId]
      )
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

    socket.on('leave room', (data) => {
      io.sockets.in(data.roomName).emit('user left room', {user: data.user})
      socket.leave(data.room)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

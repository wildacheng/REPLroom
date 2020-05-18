module.exports = (io) => {
  const users = {}

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('new-user-joined', (name) => {
      users[socket.id] = name
    }) //Might not be needed

    socket.on('send-chat-message', (data) => {
      socket
        .to(data.roomId)
        .emit('chat-message', {message: data.message, name: users[socket.id]})
      //UPDATE NAME VALUE W NEW DB OBJECT
    })

    socket.on('connectToRoom', (data) => {
      console.log(data, 'CONNECTED TO ROOM')
      if (data.name && data.roomName) {
        //just in case

        socket.join(data.roomName)

        if (!users[data.roomName]) {
          users[data.roomName] = {}
        }

        users[data.roomName][socket.id] = data.name

        io.sockets
          .in(data.roomName)
          .emit('user joined room', Object.values(users[data.roomName]))

        io.sockets
          .in(data.roomName)
          .emit('load users', Object.values(users[data.roomName]))

        io.sockets.in(data.roomName).emit('load code')
      }
    })

    socket.on('send users', (data) => {
      io.sockets.in(data.roomName).emit('receive users', data.users)
    })

    socket.on('send code', (data) => {
      io.sockets.in(data.roomName).emit('receive code for all', data.code)
    })

    socket.on('coding event', (data) => {
      io.sockets
        .in(data.roomName)
        .emit('updating code', {code: data.code, name: users[socket.id]})
    })

    socket.on('leave room', (data) => {
      io.sockets.in(data.roomName).emit('user left room', {user: data.user})
      // delete users[data.roomName][socket.id]
      socket.leave(data.room)
    })

    socket.on('stop typing', (roomName) => {
      io.sockets.in(roomName).emit('update typing name')
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

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

        // console.log(io.clients(data.roomName), "IM SOCKET CLIENT")

        if (!users[data.roomName]) {
          users[data.roomName] = {}
        }

        users[data.roomName][socket.id] = data.name

        console.log(Object.values(users[data.roomName]), 'THE USERS')

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
      console.log(data, 'GOT USERS')
      io.sockets.in(data.roomName).emit('receive users', data.users)
    })

    socket.on('send code', (data) => {
      console.log(data, 'GOT CODE')
      io.sockets.in(data.roomName).emit('receive code for all', data.code)
    })

    socket.on('coding event', (data) => {
      console.log('updated code', data)
      io.sockets.in(data.roomName).emit('updating code', data.code)
    })

    socket.on('leave room', (data) => {
      io.sockets.in(data.roomName).emit('user left room', {user: data.user})
      // delete users[data.roomName][socket.id]
      socket.leave(data.room)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

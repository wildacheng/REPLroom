module.exports = (io) => {
  let users = {}

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('new-user-joined', (data) => {
      if (!users[data.roomId]) {
        users[data.roomId] = {}
      }

      users[data.roomId][socket.id] = data.name
    })

    socket.on('send-chat-message', (data) => {
      socket.to(data.roomId).emit('chat-message', {
        message: data.message,
        name: users[data.roomId][socket.id],
      })
    })

    socket.on('connectToRoom', (data) => {
      if (data.name && data.roomId) {
        socket.join(data.roomId)

        // if (!users[data.roomId][socket.id]) {
        //   users[data.roomId][socket.id] = data.name
        // }

        //Setting users obj to store roomId & name
        if (!users[data.roomId]) {
          users[data.roomId] = {}
        }

        users[data.roomId][socket.id] = data.name

        //Emits for Room Component
        io.sockets
          .in(data.roomId)
          .emit('user joined room', Object.values(users[data.roomId]))

        io.sockets
          .in(data.roomId)
          .emit('load users', Object.values(users[data.roomId]))

        //Emits for Repl Component
        io.sockets.in(data.roomId).emit('load code')

        io.sockets.in(data.roomId).emit('load result')
      }
    })

    socket.on('send users', (data) => {
      io.sockets.in(data.roomId).emit('receive users', data.users)
    })

    socket.on('send code', (data) => {
      io.sockets.in(data.roomId).emit('receive code for all', data.code)
    })

    socket.on('send result', (data) => {
      console.log(data, 'GOT RESULT')
      io.sockets.in(data.roomId).emit('receive result for all', data.result)
    })

    socket.on('coding event', (data) => {
      io.sockets
        .in(data.roomId)
        .emit('updating code', {
          code: data.code,
          name: users[data.roomId][socket.id],
        })
    })

    socket.on('result event', (data) => {
      io.sockets.in(data.roomId).emit('updating result', data.result)
    })

    // socket.on('leave room', (data) => {
    //   console.log(socket.id, 'IM SOCKET ID')
    //   io.sockets.in(data.roomId).emit('user left room', {name: data.name})
    //   // delete users[data.roomId][socket.id]
    //   socket.leave(data.roomId)
    // })

    socket.on('stop typing', (roomId) => {
      io.sockets.in(roomId).emit('update typing name')
    })

    const getRoomId = (socketId) => {
      let roomId = ''
      Object.entries(users).find(([key, value]) => {
        if (value[socketId]) {
          roomId = key
        }
      })
      return roomId
    }

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)

      let roomId = getRoomId(socket.id)
      if (roomId) {
        delete users[roomId][socket.id]

        let remainingUsers = Object.values(users[roomId])

        io.sockets
          .in(roomId)
          .emit('user left room', {users: remainingUsers, roomId: roomId})
        console.log(remainingUsers, 'IM BACKEND USER')
      }

      socket.leave(roomId)
    })
  })
}

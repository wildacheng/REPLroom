module.exports = (io) => {
  const users = {}

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('new-user-joined', (name) => {
      users[socket.id] = name
    })

    socket.on('send-chat-message', (data) => {
      socket
        .to(data.roomId)
        .emit('chat-message', {message: data.message, name: users[socket.id]})
      //UPDATE NAME VALUE W NEW DB OBJECT
    })

    socket.on('connectToRoom', (data) => {
      if (data.name && data.roomId) {
        socket.join(data.roomId)

        if (!users[socket.id]) {
          users[socket.id] = data.name
        }

        if (!users[data.roomId]) {
          users[data.roomId] = {}
        }

        users[data.roomId][socket.id] = data.name

        console.log(Object.values(users[data.roomId]), 'THE USERS')

        io.sockets
          .in(data.roomId)
          .emit('user joined room', Object.values(users[data.roomId]))

        io.sockets
          .in(data.roomId)
          .emit('load users', Object.values(users[data.roomId]))

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
        .emit('updating code', {code: data.code, name: users[socket.id]})
    })

    //Whiteboard Events
    socket.on('add line', (data) => {
      io.in(data.roomId).emit('new line', data.lineStats)
    })

    socket.on('draw line', (data) => {
      socket.to(data.roomId).emit('client draw', data.points)
    })

    socket.on('add rect', (data) => {
      socket.to(data.roomId).emit('new rect', data.rect)
    })

    socket.on('add circ', (data) => {
      socket.to(data.roomId).emit('new circ', data.circ)
    })

    socket.on('update circs', (data) => {
      socket.to(data.roomId).emit('draw circs', data.circs)
    })

    socket.on('update rects', (data) => {
      socket.to(data.roomId).emit('draw rects', data.rects)
    })
    //End whiteboard events

    socket.on('result event', (data) => {
      io.sockets.in(data.roomId).emit('updating result', data.result)
    })

    socket.on('leave room', (data) => {
      io.sockets.in(data.roomId).emit('user left room', {user: data.user})
      // delete users[data.roomId][socket.id]
      socket.leave(data.room)
    })

    socket.on('stop typing', (roomId) => {
      io.sockets.in(roomId).emit('update typing name')
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

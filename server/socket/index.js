module.exports = (io) => {
  const users = {}

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    // socket.on('join-room', (room) => {
    //   socket.join(room)
    // })

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
      //console.log(data, 'CONNECTED TO ROOM')
      socket.join(data.roomName)
      io.sockets.in(data.roomName).emit('load users and code')
      if (data.name) {
        io.sockets.in(data.roomName).emit('user joined room', data.name)
      }
      console.log('EMITTED')
    })

    socket.on('send users and code', (data) => {
      // console.log(data, 'GOT USER AND CODE')
      socket.join(data.roomName)
      io.sockets.in(data.roomName).emit('users', data)
    })

    socket.on('updating code', (data) => {
      //console.log('updated code', data)
      io.sockets.in(data.roomName).emit('updating code', data.code)
    })

    //Whiteboard Events
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

    // socket.on('collabLine', (roomId, layer, lastLine) => {
    //   console.log('...Socket transmitting layer...', layer)
    //   socket.to(roomId).emit('addCollabLine', layer, lastLine)
    // })

    // socket.on('collabDraw', (roomId, layer, lastLine, newPoints) => {
    //   socket.to(roomId).emit('drawCollabLine', layer, lastLine, newPoints)
    // })

    //End whiteboard events

    socket.on('leave room', (data) => {
      io.sockets.in(data.roomName).emit('user left room', {user: data.user})
      socket.leave(data.room)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

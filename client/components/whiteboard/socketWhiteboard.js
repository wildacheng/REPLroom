import {addLine} from './freeDraw'
import socket from '../../socket'

socket.on('iIsDrawin', (start, end, color) => {
  draw(start, end, color)
})

whiteboard.on('draw', function (start, end, strokeColor) {
  socket.emit('clientDraw', start, end, strokeColor)
})

import {addCollabLine, drawCollabLine, lineAdd, lineDraw} from './freeDraw'
import socket from '../../socket'

// SOCKET EVENTS
lineAdd.on('addCollabLine', (roomId, layer, lastLine) => {
  console.log('**** Got line!')
  socket.emit('collabLine', roomId, layer, lastLine)
})

socket.on('addCollabLine', (layer, lastLine) => {
  console.log('\nadding collabline to layer', layer)
  addCollabLine(layer, lastLine)
})

lineDraw.on('batchDraw', (roomId, layer, lastLine, newPoints) => {
  socket.emit('collabDraw', roomId, layer, lastLine, newPoints)
})

socket.on('drawCollabLine', (layer, lastLine, newPoints) => {
  console.log('\\ndrawing', newPoints)
  drawCollabLine(layer, lastLine, newPoints)
})

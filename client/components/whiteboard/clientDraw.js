import Konva from 'konva'
import socket from '../../socket'

export const addClientLine = (layer, lineStats) => {
  let clientLine

  clientLine = new Konva.Line(lineStats)
  layer.add(clientLine)

  //have to put this in wb component?
  socket.on('client draw', (points) => {
    console.log('pts', points)
    let newPoints = clientLine.points().concat(points)
    clientLine.points(newPoints)
    layer.batchDraw()
  })
}

/* eslint-disable max-params */
import Konva from 'konva'
import socket from '../../socket'

export const addLine = (
  roomId,
  stage,
  layer, //remove!
  color,
  width,
  mode = 'inactive'
) => {
  let isPaint = false
  let lastLine
  let lineStats
  let sketchLayer

  if (mode === 'inactive') {
    stage.off('mousedown touchstart')
    stage.off('mouseup touchend')
    stage.off('mousemove touchmove')
  } else {
    stage.on('mousedown touchstart', function () {
      isPaint = true
      sketchLayer = new Konva.Layer()
      stage.add(sketchLayer)
      let pos = stage.getPointerPosition()
      lineStats = {
        stroke: mode === 'brush' ? color : '#232025',
        strokeWidth: mode === 'brush' ? width : width * 2,
        globalCompositeOperation:
          mode === 'brush' ? 'source-over' : 'destination-out',
        points: [pos.x, pos.y],
        draggable: false,
      }
      //socket.emit('add line', {roomId, lineStats})
      lastLine = new Konva.Line(lineStats)
      //layer.add(lastLine)
      sketchLayer.add(lastLine)
    })

    stage.on('mouseup touchend', function () {
      isPaint = false
      socket.emit('add line', {roomId, lineStats})
      sketchLayer.destroy()
    })

    stage.on('mousemove touchmove', function () {
      if (!isPaint) {
        return
      }
      const pos = stage.getPointerPosition()
      let newPoints = lastLine.points().concat([pos.x, pos.y])
      lastLine.points(newPoints)
      lineStats.points = newPoints
      //socket.emit('draw line', {roomId, newPoints})
      //layer.batchDraw()
      sketchLayer.batchDraw()
    })
  }
}

/* eslint-disable max-params */
import Konva from 'konva'
import socket from '../../socket'

export const addLine = (
  roomId,
  stage,
  lines,
  color,
  width,
  mode = 'inactive'
) => {
  let isPaint = false
  let lastLine
  let lineStats
  let sketchLayer
  const lineArr = []

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
        id: `line${lines.length + lineArr.length + 1}`,
      }
      lastLine = new Konva.Line(lineStats)
      sketchLayer.add(lastLine)
    })

    stage.on('mouseup touchend', function () {
      isPaint = false
      lineArr.push(lineStats)
      const allLines = lines.concat(lineArr)
      socket.emit('add line', {roomId, allLines})
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
      sketchLayer.batchDraw()
    })
  }
}

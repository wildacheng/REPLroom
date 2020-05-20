/* eslint-disable max-params */
import Konva from 'konva'
import socket from '../../socket'

export const addLine = (
  roomId,
  stage,
  //layer,
  lines,
  color,
  width,
  mode = 'inactive'
) => {
  let isPaint = false
  let lastLine
  let lineStats
  let sketchLayer
  const lineArr = [] //lines.slice()

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
      //socket.emit('add line', {roomId, lineStats})
      lastLine = new Konva.Line(lineStats)
      sketchLayer.add(lastLine)
    })

    stage.on('mouseup touchend', function () {
      isPaint = false
      //const allLines = lines.concat([lineStats])
      //const allLines = lineArr.concat([lineStats])
      lineArr.push(lineStats)
      const allLines = lines.concat(lineArr)
      console.log('What is allLines?', allLines)
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
      //socket.emit('draw line', {roomId, newPoints})
      //layer.batchDraw()
      sketchLayer.batchDraw()
    })
  }
}

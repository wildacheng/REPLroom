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

  const endDraw = () => {
    isPaint = false
    lineArr.push(lineStats)
    const allLines = lines.concat(lineArr)
    socket.emit('add line', {roomId, allLines})
    sketchLayer.destroy()
    //destroy any layers added by undetected mouseleaves
    const children = stage.getChildren()
    while (children.length > 1) {
      children[children.length - 1].destroy()
      console.log(stage.getChildren())
    }
  }

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
        points: [pos.x, pos.y],
        draggable: false,
        id: `line${lines.length + lineArr.length + 1}`,
      }
      lastLine = new Konva.Line(lineStats)
      sketchLayer.add(lastLine)
      console.log('See layers on stage?', stage)
    })

    stage.on('mouseup touchend', function () {
      if (!isPaint) {
        return
      }
      endDraw()
    })

    stage.on('mousemove touchmove', function () {
      if (!isPaint) {
        return
      }
      const pos = stage.getPointerPosition()
      let newPoints = lastLine.points().concat([pos.x, pos.y])
      lastLine.points(newPoints)
      lineStats.points = newPoints

      //Stop drawing if pen goes outside the stage
      if (pos.x < 10 || pos.y < 18 || pos.y > stage.getHeight() - 10) {
        endDraw()
      }

      sketchLayer.batchDraw()
    })
  }
}

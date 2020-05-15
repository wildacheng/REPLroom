import Konva from 'konva'

export const addLine = (stage, layer, color, width = 5, mode = 'inactive') => {
  let isPaint = false
  let lastLine

  if (mode === 'inactive') {
    stage.off('mousedown touchstart')
    stage.off('mouseup touchend')
    stage.off('mousemove touchmove')
  } else {
    stage.on('mousedown touchstart', function () {
      isPaint = true
      let pos = stage.getPointerPosition()
      lastLine = new Konva.Line({
        stroke: mode === 'brush' ? color : '#232025',
        strokeWidth: mode === 'brush' ? width : width * 2,
        globalCompositeOperation:
          mode === 'brush' ? 'source-over' : 'destination-out',
        points: [pos.x, pos.y],
        draggable: false,
      })
      layer.add(lastLine)
    })

    stage.on('mouseup touchend', function () {
      isPaint = false
    })

    stage.on('mousemove touchmove', function () {
      if (!isPaint) {
        return
      }
      const pos = stage.getPointerPosition()
      let newPoints = lastLine.points().concat([pos.x, pos.y])
      lastLine.points(newPoints)
      layer.batchDraw()
    })
  }
}

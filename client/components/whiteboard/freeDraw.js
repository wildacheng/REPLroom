/* eslint-disable max-params */
import Konva from 'konva'
import {EventEmitter} from 'events'
import socket from '../../socket'
// export const lineAdd = new EventEmitter()
// export const lineDraw = new EventEmitter()
export const updateLayer = new EventEmitter()

export const addLine = (
  roomId,
  stage,
  layer,
  color,
  width,
  mode = 'inactive'
) => {
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
      //socket.emit('collabLine', roomId, layer.toJSON(), lastLine.toJSON())
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
      //socket.emit('collabDraw', roomId, layer, lastLine, newPoints)
      layer.batchDraw()
    })
  }
}

const addCollabLine = (layer, lastLine) => {
  console.log('Function LAYER -->', layer)
  const localLayer = JSON.parse(layer)
  const localLine = JSON.parse(lastLine)
  //have to get layer somehow....
  //lastline will likely have to be new konva line
  console.log('Local layer got new line!')
  localLayer.add(localLine)
}

const drawCollabLine = (layer, lastLine, newPoints) => {
  lastLine.points(newPoints)
  layer.batchDraw()
}

// SOCKET EVENTS

socket.on('addCollabLine', (layer, lastLine) => {
  console.log('\nadding collabline to layer', layer)
  addCollabLine(layer, lastLine)
})

socket.on('drawCollabLine', (layer, lastLine, newPoints) => {
  console.log('\ndrawing', newPoints)
  drawCollabLine(layer, lastLine, newPoints)
})

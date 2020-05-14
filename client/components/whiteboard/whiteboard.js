import React, {useState, useEffect} from 'react'
import {EventEmitter} from 'events'
import './whiteboard.css'

const whiteboardEmitter = new EventEmitter()

/**
 * Draw a line on the whiteboard.
 * @param {CanvasRenderingContext2D} ctx canvas context
 * @param {[Number, Number]} start start point
 * @param {[Number, Number]} end end point
 * @param {String} strokeColor color of the line
 * @param {bool} shouldBroadcast whether to emit an event for this draw
 */
export function pencil(
  ctx,
  start,
  end,
  strokeColor = 'green',
  shouldBroadcast = true
) {
  // Draw the line between the start and end positions
  // that is colored with the given color.
  ctx.beginPath()
  ctx.strokeStyle = strokeColor
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.closePath()
  ctx.stroke()

  // If shouldBroadcast is truthy, emit a draw event to listeners
  // with the start, end and color data.
  shouldBroadcast && whiteboardEmitter.emit('pencil', start, end, strokeColor)
}

export default function Whiteboard() {
  const canvasRef = React.useRef(null)

  function getContext() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    return ctx
  }

  function pos(evt) {
    const canvas = canvasRef.current
    return [evt.pageX - canvas.offsetLeft, evt.pageY - canvas.offsetTop]
  }

  const [currentMousePos, setCurrentMousePos] = useState({
    x: 0,
    y: 0,
  })
  const [lastMousePos, setLastMousePos] = useState({
    x: 0,
    y: 0,
  })

  const [color, setColor] = useState('green')

  useEffect(() => {
    initialize()
  })

  function initialize() {
    const canvas = canvasRef.current
    const ctx = getContext()

    canvas.addEventListener('mousedown', (evt) => {
      let current = pos(evt)
      setCurrentMousePos({x: current[0], y: current[1]})
    })

    canvas.addEventListener('mousemove', (evt) => {
      if (!evt.buttons) return
      console.log('b')
      let toPos = pos(evt)
      let fromPos = [currentMousePos.x, currentMousePos.y]
      setLastMousePos(currentMousePos)
      setCurrentMousePos({x: toPos[0], y: toPos[1]})
      lastMousePos &&
        currentMousePos &&
        pencil(ctx, fromPos, toPos, color, true)
    })
  }

  function handleCanvasClick() {
    console.log(currentMousePos)
  }

  function handleClear() {
    const ctx = getContext()
    ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)
  }

  return (
    <div>
      <div className="controls">
        <button type="reset" onClick={handleClear}>
          Clear
        </button>
      </div>
      <canvas
        height={window.innerHeight}
        ref={canvasRef}
        onClick={handleCanvasClick}
      />
    </div>
  )
}

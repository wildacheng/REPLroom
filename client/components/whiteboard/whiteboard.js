import React, {useState, createRef} from 'react'
import {Stage, Layer} from 'react-konva'
import Konva from 'konva'
import Toolbar from './toolbar'
//Konva Components
import {addLine} from './freeDraw'
import {addClientLine} from './clientDraw'
import Rectangle from './rectangle'
import Circle from './circle'
// Socket.io
import socket from '../../socket'
//CSS
import './whiteboard.css'

export default function Whiteboard(props) {
  const {roomId} = props
  const stageEl = createRef()
  const layerEl = createRef()

  // ---  States --- //
  const [fillColor, setFill] = useState('rgba(0,0,0,0)')
  const [strokeColor, setStroke] = useState('#B5F44A')
  const [strokeWeight, setWeight] = useState(3)
  const [shapes, setShapes] = useState([])
  const [selectedId, selectShape] = useState(null)
  const [rectangles, setRectangles] = useState([])
  const [circles, setCircles] = useState([])

  // ---  Helpers --- //
  const addToShapes = (shapeEl) => {
    const shps = shapes.concat(shapeEl)
    setShapes(shps)
  }

  let activeLine = false

  const deactivateLine = () => {
    activeLine = false
    addLine(
      roomId,
      stageEl.current.getStage(),
      layerEl.current,
      strokeColor,
      strokeWeight,
      'inactive'
    )
  }

  const changeColor = (color) => {
    setStroke(color)
    if (activeLine) {
      addLine(
        roomId,
        stageEl.current.getStage(),
        layerEl.current,
        strokeColor,
        strokeWeight,
        'inactive'
      )
      addLine(
        roomId,
        stageEl.current.getStage(),
        layerEl.current,
        color,
        strokeWeight,
        'brush'
      )
    }
  }

  // --- Lifecycle & Socket Events --- //
  socket.on('new line', (lineStats) => {
    console.log('Layer:', layerEl, 'Current:', layerEl.current)
    // addClientLine(layerEl.current, lineStats)
    const clientLine = new Konva.Line(lineStats)
    layerEl.current.add(clientLine)
  })

  socket.on('new rect', (rect) => {
    const rects = rectangles.concat([rect])
    setRectangles(rects)
    addToShapes([rect.id])
  })

  socket.on('new circ', (circ) => {
    const circs = circles.concat([circ])
    setCircles(circs)
    addToShapes([circ.id])
  })

  socket.on('draw rects', (rects) => {
    setRectangles(rects)
  })

  socket.on('draw circs', (circs) => {
    setCircles(circs)
  })

  // ---  Whiteboard Tools  ---//
  const drawLine = () => {
    activeLine = true
    addLine(
      roomId,
      stageEl.current.getStage(),
      layerEl.current,
      strokeColor,
      strokeWeight,
      'brush'
    )
  }

  const eraseLine = () => {
    deactivateLine()
    activeLine = false
    addLine(
      roomId,
      stageEl.current.getStage(),
      layerEl.current,
      strokeColor,
      strokeWeight,
      'erase'
    )
  }

  const addRect = () => {
    deactivateLine()
    const rect = {
      x: 30,
      y: 30,
      width: 100,
      height: 100,
      stroke: strokeColor,
      fill: fillColor,
      id: `rect${rectangles.length + 1},`,
    }
    const rects = rectangles.concat([rect])
    setRectangles(rects)
    addToShapes([rect.id])
    selectShape(rect.id)
    socket.emit('add rect', {roomId, rect})
  }

  const addCircle = () => {
    deactivateLine()
    const circ = {
      x: 60,
      y: 60,
      width: 100,
      height: 100,
      stroke: strokeColor,
      fill: fillColor,
      id: `circ${circles.length + 1},`,
    }
    const circs = circles.concat([circ])
    setCircles(circs)
    addToShapes([circ.id])
    selectShape(circ.id)
    socket.emit('add circ', {roomId, circ})
  }

  return (
    <div className="whiteboard">
      <Toolbar
        changeColor={changeColor}
        setFill={setFill}
        drawLine={drawLine}
        eraseLine={eraseLine}
        addRect={addRect}
        addCircle={addCircle}
      />
      {/* This section controls drawing on the canvas "stage"--> */}
      <Stage
        width={window.innerWidth * 0.9}
        height={window.innerHeight - 100}
        ref={stageEl}
        onMouseDown={(e) => {
          //deselect
          const clickedOnEmpty = e.target === e.target.getStage()
          if (clickedOnEmpty) {
            selectShape(null)
          }
        }}
      >
        <Layer className="layer" ref={layerEl}>
          {rectangles.map((rect, i) => {
            return (
              <Rectangle
                key={rect.id}
                shapeProps={rect}
                isSelected={rect.id === selectedId}
                onSelect={() => {
                  selectShape(rect.id)
                }}
                onChange={(rectAttribs) => {
                  const rects = rectangles.slice()
                  rects[i] = rectAttribs
                  setRectangles(rects)
                  socket.emit('update rects', {roomId, rects})
                }}
              />
            )
          })}
          {circles.map((circle, i) => {
            return (
              <Circle
                key={circle.id}
                shapeProps={circle}
                isSelected={circle.id === selectedId}
                onSelect={() => {
                  selectShape(circle.id)
                }}
                onChange={(circAttribs) => {
                  const circs = circles.slice()
                  circs[i] = circAttribs
                  setCircles(circs)
                  socket.emit('update circs', {roomId, circs})
                }}
              />
            )
          })}
        </Layer>
      </Stage>
    </div>
  )
}

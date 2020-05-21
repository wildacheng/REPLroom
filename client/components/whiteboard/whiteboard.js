import React, {useState, createRef, useEffect} from 'react'
import {Stage, Layer, Line} from 'react-konva'
import Toolbar from './toolbar'
//Konva Components
import {addLine} from './freeDraw'
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
  const [activeLine, setActiveLine] = useState(false)
  const [activeEraser, setActiveEraser] = useState(false)
  const [shapes, setShapes] = useState([])
  const [selectedId, selectShape] = useState(null)
  const [rectangles, setRectangles] = useState([])
  const [circles, setCircles] = useState([])
  const [lines, setLines] = useState([])

  console.log('Lines on state:', lines)

  // ---  Helpers --- //
  const addToShapes = (shapeEl) => {
    const shps = shapes.concat(shapeEl)
    setShapes(shps)
  }

  const deactivateLine = () => {
    setActiveLine(false)
    setActiveEraser(false)
    addLine(
      roomId,
      stageEl.current.getStage(),
      lines,
      strokeColor,
      strokeWeight,
      'inactive'
    )
  }

  const changeColor = (color) => {
    setStroke(color)
    if (activeLine) {
      deactivateLine()
      setActiveLine(true)
      addLine(
        roomId,
        stageEl.current.getStage(),
        lines,
        color,
        strokeWeight,
        'brush'
      )
    }
  }

  const changeWeight = (weight) => {
    setWeight(weight)
    if (activeLine) {
      deactivateLine()
      setActiveLine(true)
      addLine(
        roomId,
        stageEl.current.getStage(),
        lines,
        strokeColor,
        weight,
        'brush'
      )
    }
    if (activeEraser) {
      deactivateLine()
      setActiveEraser(true)
      addLine(
        roomId,
        stageEl.current.getStage(),
        lines,
        strokeColor,
        weight,
        'erase'
      )
    }
  }

  const clearBoard = () => {
    socket.emit('clear board', {roomId})
  }

  // --- Lifecycle & Socket Events --- //

  // only open sockets once, so we place the listeners
  // inside a useEffect hook that only runs once
  // (empty array does not change, so does not re-render)
  useEffect(() => {
    socket.on('new line', (allLines) => {
      setLines(allLines)
      //addToShapes([line.id]) //just add last?
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

    socket.on('draw whiteboard', (data) => {
      console.log('New arrival data:', data)
      const rects = data.rectangles || []
      const circs = data.circles || []
      const allLines = data.lines || []
      setRectangles(rects)
      setCircles(circs)
      setLines(allLines)
    })

    socket.on('delete whiteboard', () => {
      setRectangles([])
      setCircles([])
      setLines([])
    })
  }, [])

  // ---  Whiteboard Tools  ---//
  const drawLine = () => {
    setActiveLine(true)
    addLine(
      roomId,
      stageEl.current.getStage(),
      lines,
      strokeColor,
      strokeWeight,
      'brush'
    )
  }

  const eraseLine = () => {
    deactivateLine()
    setActiveEraser(true)
    addLine(
      roomId,
      stageEl.current.getStage(),
      lines,
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
        activeLine={activeLine}
        changeColor={changeColor}
        setFill={setFill}
        drawLine={drawLine}
        eraseLine={eraseLine}
        addRect={addRect}
        addCircle={addCircle}
        changeWeight={changeWeight}
        clearBoard={clearBoard}
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
          {lines.map((line) => {
            return <Line key={line.id} {...line} />
          })}
        </Layer>
      </Stage>
    </div>
  )
}

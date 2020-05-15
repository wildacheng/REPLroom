import React, {useState, createRef} from 'react'
import {Stage, Layer} from 'react-konva'
//Konva Components
import {addLine} from './freeDraw'
import Rectangle from './rectangle'
import Circle from './circle'
//CSS
import './whiteboard.css'

export default function Whiteboard() {
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
      stageEl.current.getStage(),
      layerEl.current,
      strokeColor,
      strokeWeight,
      'inactive'
    )
  }

  const changeColor = (color) => {
    setStroke(color)
    //forceUpdate()
    if (activeLine) {
      addLine(
        stageEl.current.getStage(),
        layerEl.current,
        strokeColor,
        strokeWeight,
        'inactive'
      )
      addLine(
        stageEl.current.getStage(),
        layerEl.current,
        color,
        strokeWeight,
        'brush'
      )
    }
  }

  // ---  Whiteboard Tools  ---//
  const drawLine = () => {
    activeLine = true
    addLine(
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
      x: 55,
      y: 55,
      width: 80,
      height: 80,
      stroke: strokeColor,
      fill: fillColor,
      id: `rect${rectangles.length + 1},`,
    }
    //const rects = rectangles.concat([rect])
    const rects = [...rectangles, rect]
    setRectangles(rects)
    addToShapes([rect.id])
  }

  const addCircle = () => {
    deactivateLine()
    const circ = {
      x: 55,
      y: 55,
      width: 80,
      height: 80,
      stroke: strokeColor,
      fill: fillColor,
      id: `circ${circles.length + 1},`,
    }
    const circs = circles.concat([circ])
    setCircles(circs)
    addToShapes([circ.id])
  }

  return (
    <div className="whiteboard">
      {/* toolbar cannot be seperated into modular component
      because hook states cannnot be passed as props--> */}
      <div className="wbToolbar">
        <div className="colorPalette">
          <button type="button" className="toolbarBtn">
            <img
              className="toolbarIcon"
              src="/whiteboard/colorPicker.png"
              alt="line color"
            />
          </button>
          <div className="dropdownColors">
            <button
              type="button"
              className="colorbtn green"
              onClick={() => changeColor('#B5F44A')}
            />
            <button
              type="button"
              className="colorbtn blue"
              onClick={() => changeColor('#9EE0F5')}
            />
            <button
              type="button"
              className="colorbtn violet"
              onClick={() => changeColor('#6464CD')}
            />
            <button
              type="button"
              className="colorbtn red"
              onClick={() => changeColor('#FF7878')}
            />
            <button
              type="button"
              className="colorbtn silver"
              onClick={() => changeColor('#B1B1B1')}
            />
            <button
              type="button"
              className="colorbtn black"
              onClick={() => changeColor('#1D1D1D')}
            />
          </div>
        </div>
        <div className="colorPalette">
          <button type="button" className="toolbarBtn">
            <img
              className="toolbarIcon"
              src="/whiteboard/fillBucket.png"
              alt="fill color"
            />
          </button>
          <div className="dropdownColors">
            <button
              type="button"
              className="colorbtn green"
              onClick={() => setFill('#B5F44A')}
            />
            <button
              type="button"
              className="colorbtn blue"
              onClick={() => setFill('#9EE0F5')}
            />
            <button
              type="button"
              className="colorbtn violet"
              onClick={() => setFill('#6464CD')}
            />
            <button
              type="button"
              className="colorbtn red"
              onClick={() => setFill('#FF7878')}
            />
            <button
              type="button"
              className="colorbtn silver"
              onClick={() => setFill('#B1B1B1')}
            />
            <button
              type="button"
              className="colorbtn black"
              onClick={() => setFill('#1D1D1D')}
            />
            <button
              type="button"
              className="colorbtn none"
              onClick={() => setFill('rgba(0,0,0,0)')}
            >
              none
            </button>
          </div>
        </div>
        <button type="button" className="toolbarBtn" onClick={drawLine}>
          <img
            className="toolbarIcon"
            src="/whiteboard/pencil.png"
            alt="free draw"
          />
        </button>
        <button type="button" className="toolbarBtn" onClick={eraseLine}>
          <img
            className="toolbarIcon"
            src="/whiteboard/eraser.png"
            alt="eraser"
          />
        </button>
        <button type="button" className="toolbarBtn" onClick={addRect}>
          <img
            className="toolbarIcon"
            src="/whiteboard/rect.png"
            alt="create rectangle"
          />
        </button>
        <button type="button" className="toolbarBtn" onClick={addCircle}>
          <img
            className="toolbarIcon"
            src="/whiteboard/circle.png"
            alt="create circle"
          />
        </button>
      </div>
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
        <Layer ref={layerEl}>
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
                }}
              />
            )
          })}
        </Layer>
      </Stage>
    </div>
  )
}

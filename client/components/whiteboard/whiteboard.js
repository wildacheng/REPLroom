import React from 'react'
import './whiteboard.css'

function draw(ctx, location) {}

function Whiteboard() {
  const [locations, setLocations] = React.useState([])
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)
    locations.forEach((location) => draw(ctx, location))
  })

  function handleCanvasClick(e) {
    const newLocation = {x: e.clientX, y: e.clientY}
    setLocations([...locations, newLocation])
  }

  function handleClear() {
    setLocations([])
  }

  function handleUndo() {
    setLocations(locations.slice(0, locations.length - 1))
  }

  return (
    <div>
      <div className="controls">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
      </div>
      <canvas
        // width="100%" {window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
        onClick={handleCanvasClick}
      />
    </div>
  )
}

export default Whiteboard

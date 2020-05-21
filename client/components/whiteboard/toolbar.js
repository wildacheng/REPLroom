import React from 'react'

const Toolbar = (props) => {
  const {
    activeLine,
    changeColor,
    setFill,
    drawLine,
    eraseLine,
    addRect,
    addCircle,
    changeWeight,
    clearBoard,
  } = props

  return (
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
      <div className="weightPalette">
        <button type="button" className="toolbarBtn">
          <img
            className="toolbarIcon"
            src="/whiteboard/lineWeight.png"
            alt="line weight"
          />
        </button>
        <div className="dropdownLines">
          <button
            type="button"
            className="lineBtn onePointFive"
            onClick={() => changeWeight(1)}
          >
            <img className="toolbarIcon" src="/whiteboard/onePt.png" />
          </button>
          <button
            type="button"
            className="lineBtn three"
            onClick={() => changeWeight(3)}
          >
            <img className="toolbarIcon" src="/whiteboard/threePt.png" />
          </button>
          <button
            type="button"
            className="lineBtn six"
            onClick={() => changeWeight(8)}
          >
            <img className="toolbarIcon" src="/whiteboard/sixPt.png" />
          </button>
          <button
            type="button"
            className="lineBtn twelve"
            onClick={() => changeWeight(20)}
          >
            <img className="toolbarIcon" src="/whiteboard/twelvePt.png" />
          </button>
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
      <button
        type="button"
        className="toolbarBtn"
        onClick={() => {
          if (!activeLine) {
            drawLine()
          }
        }}
      >
        <img
          className="toolbarIcon"
          src="/whiteboard/pencil.png"
          alt="free draw"
        />
      </button>
      <button type="button" className="toolbarBtn" onClick={() => eraseLine()}>
        <img
          className="toolbarIcon"
          src="/whiteboard/eraser.png"
          alt="eraser"
        />
      </button>
      <button
        type="button"
        className="toolbarBtn"
        onClick={() => {
          addRect()
        }}
      >
        <img
          className="toolbarIcon"
          src="/whiteboard/rect.png"
          alt="create rectangle"
        />
      </button>
      <button
        type="button"
        className="toolbarBtn"
        onClick={() => {
          addCircle()
        }}
      >
        <img
          className="toolbarIcon"
          src="/whiteboard/circle.png"
          alt="create circle"
        />
      </button>
      <button
        type="button"
        className="toolbarBtn"
        onClick={() => {
          clearBoard()
        }}
      >
        <img
          className="toolbarIcon"
          src="/whiteboard/clearBoard.png"
          alt="clear board"
        />
      </button>
    </div>
  )
}

export default Toolbar

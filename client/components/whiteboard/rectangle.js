import React, {useEffect, useRef, Fragment} from 'react'
import {Rect, Transformer} from 'react-konva'

const Rectangle = ({shapeProps, isSelected, onSelect, onChange}) => {
  const shapeRef = useRef()
  const transRef = useRef()

  useEffect(() => {
    if (isSelected) {
      //attach transformer
      transRef.current.nodes([shapeRef.current])
      transRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <Fragment>
      <Rect
        onClick={() => onSelect()}
        ref={shapeRef}
        {...shapeProps}
        draggable={!!isSelected}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={() => {
          // changing scale
          const node = shapeRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          node.scaleX(1)
          node.scaleY(1)
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          })
        }}
      />
      {isSelected && <Transformer ref={transRef} />}
    </Fragment>
  )
}

export default Rectangle

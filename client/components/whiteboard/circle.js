import React, {useRef, useEffect, Fragment} from 'react'
import {Ellipse, Transformer} from 'react-konva'

const Circ = ({shapeProps, isSelected, onSelect, onChange}) => {
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
      <Ellipse
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
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

export default Circ

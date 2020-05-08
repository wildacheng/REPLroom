import React from 'react'

const WorkerOutput = (props) => {
  const {output} = props
  const strArr = output.split('^+')
  return (
    <div>
      {strArr.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  )
}

export default WorkerOutput

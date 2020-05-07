import React from 'react'
import workerScript from './worker'

var myWorker = new Worker(workerScript)

const f = function () {
  function sum(a, b) {
    return a + b
  }
  function hello() {
    return 'hello world'
  }

  console.log(sum(3, 4))
  console.log(hello())
}

const Webworkermain = () => {
  const handleWebWorker = () => {
    myWorker.onmessage = (m) => {
      console.log('result of function ', m.data)
    }
    myWorker.postMessage([typeof f, f.toString()])
  }

  return (
    <div>
      <h2>In web worker main file</h2>
      <button type="button" onClick={() => handleWebWorker()}>
        On Web worker
      </button>
    </div>
  )
}

export default Webworkermain

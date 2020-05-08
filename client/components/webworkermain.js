import React, {Component} from 'react'
import workerScript from './worker'
import WorkerOutput from './workerOutput'

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

const TIMEOUT = 15000

class Webworkermain extends Component {
  constructor() {
    super()
    this.state = {
      userCode: `function sum(a, b) {
        return a + b
      }
      function hello() {
        return 'hello world'
      }

      console.log(sum(3,4))
      console.log(hello())`,
    }
  }

  handleTerminal = (data) => {
    return <WorkerOutput output={data} />
  }

  functionWrapper = (str) => {
    return new Function(str).toString()
  }

  handleWebWorker = () => {
    const myWorker = new Worker(workerScript)

    myWorker.onmessage = (m) => {
      console.log('result of function ', m.data)
      // <WorkerOutput />
      this.handleTerminal(m.data)
    }

    myWorker.postMessage([typeof f, this.functionWrapper(this.state.userCode)])

    setTimeout(() => myWorker.terminate(), TIMEOUT)
  }

  render() {
    return (
      <div>
        <h2>In web worker main file</h2>
        <button type="button" onClick={() => this.handleWebWorker()}>
          Run code
        </button>
      </div>
    )
  }
}

export default Webworkermain

// blobForWorker(data) {
//   const jsFile = CodeWorker.toString()
//   return new Blob(['(' + jsFile + ')()'])
// }
// runWorker(input) {
//   //input get passed to CodeWorker
//   const myBlob = this.blobForWorker();
//   this.worker = new Worker(URL.createObjectURL(myBlob));
//   this.worker.addEventListener('message', (evt) => {
//     console.log('<WorkerHandler>--->', evt.data);
//   })
//   this.worker.postMessage(input)
//   //this.worker.postMessage(bigStr)
//   setTimeout(() => this.worker.terminate(), 10000)
// }

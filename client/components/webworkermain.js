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

const TIMEOUT = 10000

class Webworkermain extends Component {
  constructor() {
    super()
    this.state = {
      userCode: `
      function sum(a, b) {
        return a + b
      }

      function hello() {
        return 'hello world'
      }

      console.log(sum(3, 4))
      console.log(hello())
      `,
      result: '',
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
      this.setState({result: m.data})
    }

    myWorker.postMessage([typeof f, this.functionWrapper(this.state.userCode)])

    setTimeout(() => {
      console.log('Terminating!!!!!')
      myWorker.terminate()
    }, TIMEOUT)
  }

  render() {
    return (
      <div>
        <h2>In web worker main file</h2>
        <button type="button" onClick={() => this.handleWebWorker()}>
          Run code
        </button>
        <WorkerOutput output={this.state.result} />
      </div>
    )
  }
}

export default Webworkermain

import React, {Component} from 'react'
const io = require('socket.io-client')
const socket = io()
import Codemirror from 'react-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'
import workerScript from './replWorker'
import WorkerOutput from './replTerminal'

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

class Repl extends Component {
  constructor() {
    super()
    this.state = {
      code: '',
      result: '',
      guestList: [],
    }
  }

  updateCodeInState = (newText) => {
    this.setState({code: newText})
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

    myWorker.postMessage([typeof f, this.functionWrapper(this.state.code)])

    setTimeout(() => {
      console.log('Terminating!!!!!')
      myWorker.terminate()
    }, TIMEOUT)
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'monokai',
    }

    return (
      <div>
        {console.log(this.state.code)}
        <Codemirror
          value={this.state.code}
          onChange={this.updateCodeInState}
          options={options}
        />
        <button type="button" onClick={() => this.handleWebWorker()}>
          Run
        </button>
        <WorkerOutput output={this.state.result} />
      </div>
    )
  }
}

export default Repl

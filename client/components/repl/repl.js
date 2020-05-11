import React, {Component} from 'react'
const io = require('socket.io-client')
const socket = io()
import {Controlled as Codemirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
require('codemirror/mode/javascript/javascript.js')
import workerScript from './replWorker'
import WorkerOutput from './replTerminal'
import parseCode from './parser'

const TIMEOUT = 8000

class Repl extends Component {
  constructor() {
    super()
    this.state = {
      code: '// your code here\n',
      result: '',
      //guestList: [],
    }
  }

  updateCodeInState = (newText) => {
    this.setState({code: newText})
  }

  handleTerminal = (data) => {
    return <WorkerOutput output={data} />
  }

  functionWrapper = (str) => {
    // eslint-disable-next-line no-new-func
    return new Function(str).toString()
  }

  handleWebWorker = () => {
    const myWorker = new Worker(workerScript)

    myWorker.onmessage = (m) => {
      this.setState({result: m.data})
    }

    const parsedCode = parseCode(this.state.code)

    myWorker.postMessage([typeof f, this.functionWrapper(parsedCode)])

    setTimeout(() => {
      console.log('Terminating!!!')
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
        <Codemirror
          value={this.state.code}
          options={options}
          onBeforeChange={(editor, data, value) => {
            this.updateCodeInState(value)
          }}
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

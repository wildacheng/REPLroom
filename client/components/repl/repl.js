import React, {Component} from 'react'
import {Controlled as Codemirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js' //look into this
import workerScript from './replWorker'
import WorkerOutput from './replTerminal'
import parseCode from './parser'

//SOCKET
import io from 'socket.io-client'

const TIMEOUT = 6000

class Repl extends Component {
  constructor() {
    super()
    this.state = {
      code: '// your code here\n',
      result: '',
    }
    //maybe add params here
    this.socket = io(window.location.origin)
    this.socket.on('updating code', ({code}) => {
      this.getNewCodeFromServer(code)
    })
  }

  updateCodeInState = (newText) => {
    this.setState({code: newText})
    this.socket.emit('updating code', {code: this.state.code})
  }

  getNewCodeFromServer = (code) => {
    this.setState({code: code})
    console.log(this.state)
  }

  // componentDidMount() {
  //   this.socket.on('updating code', ({code}) => {
  //     console.log(code)
  //   })
  // }

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
        {console.log(this.props)}
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

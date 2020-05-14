import React, {Component} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
//Code Mirror
import {Controlled as Codemirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
//import 'codemirror/theme/monokai.css'
import 'codemirror/theme/material-palenight.css'
import 'codemirror/mode/javascript/javascript.js' //look into this
//local scripts
import workerScript from './replWorker'
import WorkerOutput from './replTerminal'
import parseCode from './parser'
//SOCKET
import io from 'socket.io-client'
//CSS
import './repl.css'

const TIMEOUT = 8000

class Repl extends Component {
  constructor() {
    super()
    this.state = {
      code: '// your code here\n',
      result: '',
      height: '65%', //height of the editor
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
      theme: 'material-palenight',
      viewportMargin: Infinity,
    }

    return (
      <SplitPane
        split="horizontal"
        minSize={5}
        maxSize={-5}
        defaultSize={this.state.height}
      >
        <Pane className="pane">
          <Codemirror
            value={this.state.code}
            options={options}
            onBeforeChange={(_editor, _data, value) => {
              this.updateCodeInState(value)
            }}
          />
        </Pane>
        <Pane className="pane">
          <WorkerOutput
            output={this.state.result}
            handleRun={this.handleWebWorker}
          />
        </Pane>
      </SplitPane>
    )
  }
}

export default Repl

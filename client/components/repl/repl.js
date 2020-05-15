import React, {Component} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
import {withRouter} from 'react-router'
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
// import io from 'socket.io-client'
import socket from '../../socket'
//CSS
import './repl.css'

const TIMEOUT = 8000

class Repl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      result: '',
      // currentUser: '',
      height: 350, //height of the editor
      width: 400, //width of left panel
    }
  }

  componentDidMount() {
    socket.on('load code', () => {
      this.sendCode()
    })

    socket.on('receive code for all', (code) => {
      console.log('RECEIVED CODE FOR ALL', code)
      this.updateCodeForAll(code)
    })

    socket.on('updating code', (code) => {
      this.getNewCodeFromServer(code)
    })

    socket.on('updating result', (result) => {
      this.getNewResultFromServer(result)
    })
  }

  sendCode = () => {
    socket.emit('send code', {
      roomId: this.props.match.params.roomId,
      code: this.state.code,
    })
  }

  updateCodeForAll = (code) => {
    console.log(code, 'UPDATE CODE FOR ALL')
    this.setState({code: code})
  }

  updateCodeInState = (newCode) => {
    this.setState({code: newCode})
    socket.emit('coding event', {
      roomId: this.props.match.params.roomId,
      code: newCode,
    })
  }

  getNewCodeFromServer = (code) => {
    this.setState({code: code})
    console.log(this.state)
  }

  getNewResultFromServer = (result) => {
    this.setState({result: result})
    console.log(result, 'RESULT FOR ALL')
  }

  handleTerminal = (data) => {
    return <WorkerOutput output={data} />
  }

  functionWrapper = (str) => {
    // eslint-disable-next-line no-new-func
    return new Function(str).toString()
  }

  updateResult = (data) => {
    this.setState({result: data})
    socket.emit('result event', {
      roomId: this.props.match.params.roomId,
      result: data,
    })
  }

  handleWebWorker = () => {
    const myWorker = new Worker(workerScript)

    myWorker.onmessage = (m) => {
      // this.setState({result: m.data})
      console.log(m.data, 'WEB WORKER')
      this.updateResult(m.data)
    }

    console.log(this.state.code, 'CURRENT WEBWORKER STATE')
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
      <SplitPane split="horizontal" defaultSize={this.state.height}>
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

export default withRouter(Repl)

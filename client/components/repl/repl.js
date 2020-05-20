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
//Socket
import socket from '../../socket'
//CSS
import './repl.css'

const TIMEOUT = 10000
let typingTimer
let runtimeTimer

class Repl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '// your code here\n',
      result: '',
      currentlyTyping: '',
      height: '65%', //height of the editor
    }
  }

  componentDidMount() {
    socket.on('load code', () => {
      this.sendCode()
    })

    socket.on('load result', () => {
      this.sendResult()
    })

    socket.on('receive code for all', (code) => {
      console.log('RECEIVED CODE FOR ALL', code)
      this.updateCodeForAll(code)
    })

    socket.on('receive result for all', (result) => {
      console.log('RECEIVED RESULT FOR ALL', result)
      this.updateResultForAll(result)
    })

    socket.on('updating code', (data) => {
      this.getNewCodeFromServer(data.code)
      clearTimeout(typingTimer)
      this.setState({
        currentlyTyping: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      })
    })

    socket.on('updating result', (result) => {
      this.getNewResultFromServer(result)
    })

    socket.on('update typing name', () => {
      this.setState({
        currentlyTyping: '',
      })
    })
  }

  handleKeyDown = () => {
    clearTimeout(typingTimer)
  }

  handleKeyUp = () => {
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      this.setState({
        currentlyTyping: '',
      })
      socket.emit('stop typing', this.props.match.params.roomId)
    }, 5000)
  }

  sendCode = () => {
    if (this.state.code) {
      socket.emit('send code', {
        roomId: this.props.match.params.roomId,
        code: this.state.code,
      })
    }
  }

  sendResult = () => {
    if (this.state.result) {
      console.log('NEW STATE', this.state.result)
      socket.emit('send result', {
        roomId: this.props.match.params.roomId,
        result: this.state.result,
      })
    }
  }

  updateCodeForAll = (code) => {
    this.setState({code: code})
  }

  updateResultForAll = (result) => {
    console.log(result, 'UPDATE RESULT FOR ALL')
    this.setState({result: result})
  }

  updateCodeInState = (newCode) => {
    // clearTimeout(typingTimer)
    this.setState({code: newCode})
    socket.emit('coding event', {
      roomId: this.props.match.params.roomId,
      code: newCode,
      socketId: socket.id,
    })
  }

  getNewCodeFromServer = (code) => {
    this.setState({code: code})
    console.log(this.state)
  }

  getNewResultFromServer = (result) => {
    this.setState({result: result})
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

    const parsedCode = parseCode(this.state.code)
    myWorker.postMessage(this.functionWrapper(parsedCode))
    runtimeTimer = setTimeout(() => {
      this.updateResult('  <  Timeout occurred! Terminating!!!!!\n')
      myWorker.terminate()
    }, TIMEOUT)

    myWorker.onmessage = (m) => {
      clearTimeout(runtimeTimer)
      this.updateResult(m.data)
    }
  }

  render() {
    const options = {
      lineNumbers: true,
      lineWrapping: true,
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
          <div className="currently-typing">
            {this.state.currentlyTyping &&
              `${this.state.currentlyTyping} is typing...`}
          </div>
          <Codemirror
            value={this.state.code}
            options={options}
            onBeforeChange={(_editor, _data, value) => {
              this.updateCodeInState(value)
            }}
            onKeyUp={this.handleKeyUp}
            onKeyDown={this.handleKeyDown}
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

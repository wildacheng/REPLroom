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
//CSS
import './repl.css'

const TIMEOUT = 8000
let typingTimer

class Repl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '// your code here\n',
      result: '',
      // currentUser: '',
      currentlyTyping: '',
      height: '65%', //height of the editor
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

    socket.on('updating code', (data) => {
      this.getNewCodeFromServer(data.code)
      clearTimeout(typingTimer)
      this.setState({
        currentlyTyping: data.name,
      })
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
    socket.emit('send code', {
      roomName: this.props.match.params.roomId,
      code: this.state.code,
    })
  }

  updateCodeForAll = (code) => {
    this.setState({code: code})
  }

  updateCodeInState = (newCode) => {
    // clearTimeout(typingTimer)
    this.setState({code: newCode})
    socket.emit('coding event', {
      roomName: this.props.match.params.roomId,
      code: newCode,
      socketId: socket.id,
    })
  }

  getNewCodeFromServer = (code) => {
    this.setState({code: code})
    console.log(this.state)
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
  }

  handleWebWorker = () => {
    const myWorker = new Worker(workerScript)

    myWorker.onmessage = (m) => {
      // this.setState({result: m.data})
      this.updateResult(m.data)
    }

    const parsedCode = parseCode(this.code)
    myWorker.postMessage([typeof f, this.functionWrapper(parsedCode)])

    setTimeout(() => {
      myWorker.terminate()
    }, TIMEOUT)
  }

  render() {
    console.log('this.state.currentlyTyping', this.state.currentlyTyping)
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

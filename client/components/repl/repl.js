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
import io from 'socket.io-client'
import socket from '../../socket'
//CSS
import './repl.css'

const TIMEOUT = 8000

class Repl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '// your code here\n',
      result: '',
      // currentUser: '',
      height: 350, //height of the editor
      width: 400, //width of left panel
      currentlyTyping: '',
      typing: false,
      timer: 0,
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
      this.setState({
        //set a clock here and reset it everytime this setState is called. if the clock reached 5 secs stop showing who is typing
        timer: 1,
        typing: true,
        currentlyTyping: data.name,
      })
      this.handleSetTimeOut()
    })
  }

  handleSetTimeOut = () => {
    console.log('set time out called!!!')
    if (this.state.typing) {
      setTimeout(() => {
        this.setState({
          typing: false,
          currentlyTyping: '',
        })
      }, 5000)
    }
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
      console.log('Terminating!!!')
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
      <SplitPane split="horizontal" defaultSize={this.state.height}>
        <Pane className="pane">
          <div className="currently-typing">{this.state.currentlyTyping}</div>
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

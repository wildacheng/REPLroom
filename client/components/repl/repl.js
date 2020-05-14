import React, {Component} from 'react'
import {withRouter} from 'react-router'
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
import socket from '../../socket'
//CSS
import './repl.css'

const TIMEOUT = 8000

class Repl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 350, //height of the editor
      width: 400, //width of left panel
      roomId: this.props.match.params.roomId,
      code: '// your code here\n',
      result: '',
      typer: '',
    }
    socket.on('code from server', (roomData) => {
      this.setState({code: roomData.code})
      //eventually put person typing
      console.log(this.state)
    })
  }

  //HANDLE CODEMIRROR INPUT/SANDBOX DISPLAY METHODS
  updateCodeInState = (code) => {
    this.setState({code: code})
    socket.emit('updating code', {
      roomId: this.state.roomId,
      code: this.state.code,
    })
  }

  //HANDLE OUTPUT TERMINAL METHODS
  updateResult = (data) => {
    this.setState({result: data})
  }

  handleTerminal = (data) => {
    return <WorkerOutput output={data} />
  }

  //WEBWORKER METHODS
  functionWrapper = (str) => {
    // eslint-disable-next-line no-new-func
    return new Function(str).toString()
  }

  handleWebWorker = () => {
    const myWorker = new Worker(workerScript)

    myWorker.onmessage = (m) => {
      // this.setState({result: m.data})
      this.updateResult(m.data)
    }

    const parsedCode = parseCode(this.state.code)
    myWorker.postMessage([typeof f, this.functionWrapper(parsedCode)])

    setTimeout(() => {
      console.log('Terminating!!!')
      myWorker.terminate()
    }, TIMEOUT)
  }

  //REACT LIFECYCLE HOOKS / SOCKETS
  componentDidMount() {
    //need to make a DB call here - or set up a makeshift one for now
    socket.emit('fetch code from server', {
      code: this.state.code,
      roomId: this.state.roomId,
    })
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
          {/* put "typer" component here */}
          <Codemirror
            value={this.state.code}
            options={options}
            //fix update code to be on local state
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

//THIS MAY BE UNECESSARY
// getNewCodeFromServer = (code) => {
//   this.setState({code: code})
//   console.log(this.state)
// }

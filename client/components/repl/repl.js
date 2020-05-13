import React, {Component} from 'react'

//CODEMIRROR
import Codemirror from 'react-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'

//WEBWORKERS/REPL
import workerScript from './replWorker'
import WorkerOutput from './replTerminal'
import parseCode from './parser'

//SOCKET
import io from 'socket.io-client'
const socket = io()

const TIMEOUT = 6000

class Repl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: 'Your code here',
      result: '',
      collaborators: [],
    }

    socket.on('updating code', ({code}) => {
      this.getNewCodeFromServer(code)
    })

    socket.on('user joined room', (data) => {
      console.log(data, 'IM CONNECTED TO A ROOM')
      this.joinUser(data)
    })
  }

  componentDidMount() {
    const name = this.props.location.state.name
    const roomName = this.props.match.params.roomId
    socket.emit('connectToRoom', {name: name, roomName: roomName})
  }

  joinUser = (name) => {
    this.setState((prevState) => {
      return {collaborators: [...prevState.collaborators, name]}
    })
  }

  updateCodeInState = (newText) => {
    this.setState({code: newText})
    socket.emit('updating code', {code: this.state.code})
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

  handleWebWorker = () => {
    const myWorker = new Worker(workerScript)

    myWorker.onmessage = (m) => {
      //console.log('result of function ', m.data)
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

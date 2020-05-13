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
const io = require('socket.io-client')
const socket = io(window.location.origin)

const TIMEOUT = 6000

class Repl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: 'Your code here',
      result: '',
      users: [],
      currentUser: '',
    }
  }

  componentDidMount() {
    socket.on('load users and code', () => {
      this.sendUsersAndCode()
    })

    socket.on('user joined room', (data) => {
      console.log(data, 'IM CONNECTED TO A ROOM')
      this.joinUser(data)
    })
    socket.on('users', (data) => {
      console.log('RECEIVED', data)
      this.updateUsersAndCodeInState(data)
    })

    socket.on('updating code', (code) => {
      this.getNewCodeFromServer(code)
    })

    socket.on('user left room', (user) => {
      this.removeUser(user)
    })

    const name = this.props.location.state.name
    const roomName = this.props.match.params.roomId
    socket.emit('connectToRoom', {name: name, roomName: roomName})
  }

  componentWillUnmount() {
    socket.emit('leave room', {
      roomName: this.state.roomName,
      user: this.state.currentUser,
    })
  }

  componentDidUpdate() {
    // const roomName = this.props.match.params.roomId
    // socket.emit('connectToRoom', {name: name, roomName: roomName})
    console.log(this.state.users, 'USERS')
    console.log(this.state.currentUser, 'current user')
  }

  sendUsersAndCode = () => {
    socket.emit('send users and code', {
      roomName: this.props.match.params.roomId,
      users: this.state.users,
      code: this.state.code,
    })
  }

  joinUser = (name) => {
    //Array.from creates a new array from the new Set
    const combinedUsers = [...this.state.users, name]
    const newUsers = Array.from(new Set(combinedUsers))
    const cleanUsers = newUsers.filter((user) => {
      return user.length > 1
    })
    this.setState({users: cleanUsers, currentUser: name})
  }

  updateUsersAndCodeInState = (data) => {
    const combinedUsers = this.state.users.concat(data.users)
    const newUsers = Array.from(new Set(combinedUsers))
    const cleanUsers = newUsers.filter((user) => {
      return user.length > 1
    })
    this.setState({users: cleanUsers, code: data.code})
  }

  removeUser(user) {
    const newUsers = Object.assign([], this.state.users)
    const indexOfUserToDelete = this.state.users.findIndex((Olduser) => {
      return Olduser === user.user
    })
    newUsers.splice(indexOfUserToDelete, 1)
    this.setState((prevState) => {
      return {users: newUsers}
    })
  }

  updateCodeInState = (newText) => {
    this.setState({code: newText})
    socket.emit('updating code', {
      roomName: this.props.match.params.roomId,
      code: this.state.code,
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

import React, {Component} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
import {Modal} from 'react-bootstrap'
import RoomNav from './roomNav'
import Repl from '../repl/repl'
import Whiteboard from '../whiteboard/whiteboard'
import VideoChat from '../video-chat'
import Chat from '../chat'
//SOCKET
//import io from 'socket.io-client'
import socket from '../../socket'
import 'bootstrap/dist/css/bootstrap.min.css'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '// your code here\n',
      result: '',
      users: [],
      currentUser: this.props.location.state
        ? this.props.location.state.name
        : '',
      width: '50%', //width of left pane
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

    // console.log('this.props', this.props.location.state)
    // if (this.props.location.state) {
    //   console.log('inside if', this.props.location.state.name)
    //   this.setState({currentUser: 'Mohana'})
    //   console.log('state set!!!')
    // }

    // console.log('this.state', this.state)

    // const name = this.props.location.state.name
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

  joinUser = (users) => {
    console.log(users, 'IM JOIN NAME')
    this.setState({users: users})
  }

  // joinUser = (name) => {
  //   //Array.from creates a new array from the new Set
  //   const combinedUsers = [...this.state.users, name]
  //   const newUsers = Array.from(new Set(combinedUsers))
  //   const cleanUsers = newUsers.filter((user) => {
  //     return user.length > 1
  //   })
  //   this.setState({users: cleanUsers, currentUser: name})
  // }

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

  //WebWorker Functions Prop
  updateResult = (data) => {
    this.setState({result: data})
  }

  handleEnteredName = () => {
    this.setState({
      currentUser: this.textInput.value,
    })
  }

  render() {
    console.log('this.state', this.state)
    return (
      <div>
        <RoomNav roomId={this.props.match.params.roomId} />
        {!this.state.currentUser && (
          <div>
            <Modal
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={!this.state.currentUser}
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                  Please enter your name to proceed
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="container">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    ref={(input) => (this.textInput = input)}
                  ></input>
                  <button type="button" onClick={this.handleEnteredName}>
                    {' '}
                    Enter Name{' '}
                  </button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        )}
        <SplitPane
          split="vertical"
          minSize={5}
          maxSize={-5}
          defaultSize={this.state.width}
        >
          <Repl
            code={this.state.code}
            result={this.state.result}
            updateResult={this.updateResult}
            updateCode={this.updateCodeInState}
          />
          <Pane className="pane whiteboardPane">
            <Whiteboard />
          </Pane>
        </SplitPane>
        <VideoChat roomName={this.props.match.params.roomId} />
        <Chat
          roomName={this.props.match.params.roomId}
          userName={this.state.currentUser}
        />
      </div>
    )
  }
}

import React, {Component} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
import {Modal} from 'react-bootstrap'
import RoomNav from './roomNav'
import Repl from '../repl/repl'
import Whiteboard from '../whiteboard/whiteboard'
import VideoChat from '../video-chat'
import Chat from '../chat'
//SOCKET
import socket from '../../socket'
import 'bootstrap/dist/css/bootstrap.min.css'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      currentUser: this.props.location.state
        ? this.props.location.state.name
        : '',
      width: '50%', //width of left pane
    }
  }

  componentDidMount() {
    const roomName = this.props.match.params.roomId

    if (this.state.currentUser && roomName) {
      socket.emit('connectToRoom', {
        name: this.state.currentUser,
        roomName: roomName,
      })
    }

    socket.on('load users', () => {
      this.sendUsers()
    })

    socket.on('user joined room', (data) => {
      this.joinUser(data)
    })

    socket.on('receive users', (users) => {
      console.log('RECEIVED USERS', users)
      this.updateUsersForAll(users)
    })

    socket.on('user left room', (user) => {
      this.removeUser(user)
    })

    socket.emit('connectToRoom', {
      name: this.state.currentUser,
      roomName: roomName,
    })
  }

  componentWillUnmount() {
    socket.emit('leave room', {
      roomName: this.state.roomName,
      user: this.state.currentUser,
    })
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

  joinUser = (users) => {
    console.log(users, 'IM JOIN NAME')
    this.setState((prevState) => ({users: users}))
  }

  updateUsersForAll = (users) => {
    this.setState((prevState) => ({users: users}))
  }

  sendUsers = () => {
    this.state.users && this.state.users.length
      ? socket.emit('send users', {
          roomName: this.props.match.params.roomId,
          users: this.state.users,
        })
      : socket.emit('send users', {
          roomName: this.props.match.params.roomId,
        })
  }

  handleEnteredName = () => {
    this.setState({
      currentUser: this.textInput.value,
    })
  }

  handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleEnteredName()
    }
  }

  render() {
    console.log('this.state', this.state)
    return (
      <div>
        <RoomNav
          roomId={this.props.match.params.roomId}
          users={this.state.users}
        />
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
                    onKeyDown={this.handleEnterKeyPress}
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
            <Whiteboard roomId={this.props.match.params.roomId} />
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

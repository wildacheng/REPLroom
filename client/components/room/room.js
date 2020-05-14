import React, {Component} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
import RoomNav from './roomNav'
import Repl from '../repl/repl'
//SOCKET
import socket from '../../socket'

import VideoChat from '../video-chat'
import Chat from '../chat'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socketId: socket.id,
      roomId: this.props.match.params.roomId,
      username: this.props.location.state.name,
      users: [],
      width: '45%', //width of left pane
    }
  }

  componentDidMount() {
    socket.on('join room', (data) => {
      console.log(data, 'IM CONNECTED TO A ROOM')
      this.joinUser(data)
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

  render() {
    return (
      <div>
        <RoomNav />
        <SplitPane split="vertical" minSize={50} defaultSize={this.state.width}>
          <Repl roomName={this.state.room} />
          <Pane className="pane">
            <div> WHITEBOARD</div>
          </Pane>
        </SplitPane>
        <VideoChat roomName={this.state.roomId} />
        <Chat roomName={this.state.roomId} userName={this.state.name} />
      </div>
    )
  }
}

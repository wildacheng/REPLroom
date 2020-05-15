import React, {Component} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
import RoomNav from './roomNav'
import Repl from '../repl/repl'
//SOCKET
// import io from 'socket.io-client'
import socket from '../../socket'

import VideoChat from '../video-chat'
import Chat from '../chat'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      width: '45%', //width of left pane
    }
  }

  componentDidMount() {
    const name = this.props.location.state.name
    const roomId = this.props.match.params.roomId

    if (name && roomId) {
      socket.emit('connectToRoom', {name: name, roomId: roomId})
    }

    socket.on('load users', () => {
      this.sendUsers()
    })

    socket.on('user joined room', (data) => {
      console.log(data, 'IM CONNECTED TO A ROOM')
      this.joinUser(data)
    })

    socket.on('receive users', (users) => {
      console.log('RECEIVED USERS', users)
      this.updateUsersForAll(users)
    })

    socket.on('user left room', (user) => {
      this.removeUser(user)
    })
  }

  componentWillUnmount() {
    socket.emit('leave room', {
      roomId: this.state.roomId,
      user: this.state.currentUser,
    })
  }

  // componentDidUpdate() {
  // const roomId = this.props.match.params.roomId
  // socket.emit('connectToRoom', {name: name, roomId: roomId})
  //   console.log(this.state.users, 'USERS')
  //   console.log(this.state.currentUser, 'current user')
  // }

  joinUser = (users) => {
    console.log(users, 'IM JOIN NAME')
    this.setState({users: users})
  }

  updateUsersForAll = (users) => {
    this.setState({users: users})
  }

  sendUsers = () => {
    this.state.users && this.state.users.length
      ? socket.emit('send users', {
          roomId: this.props.match.params.roomId,
          users: this.state.users,
        })
      : socket.emit('send users', {
          roomId: this.props.match.params.roomId,
        })
  }

  // removeUser(user) {
  //   const newUsers = Object.assign([], this.state.users)
  //   const indexOfUserToDelete = this.state.users.findIndex((Olduser) => {
  //     return Olduser === user.user
  //   })
  //   newUsers.splice(indexOfUserToDelete, 1)
  //   this.setState((prevState) => {
  //     return {users: newUsers}
  //   })
  // }

  //ADD PROPS TO ROOMNAV FOR COLLABS
  render() {
    return (
      <div>
        <RoomNav users={this.state.users} />
        <SplitPane split="vertical" minSize={50} defaultSize={this.state.width}>
          <Repl />
          <Pane className="pane">
            <div> WHITEBOARD</div>
          </Pane>
        </SplitPane>
        <VideoChat roomId={this.props.match.params.roomId} />
        <Chat
          roomId={this.props.match.params.roomId}
          userName={this.props.location.state.name}
        />
      </div>
    )
  }
}

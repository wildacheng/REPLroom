import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import io from 'socket.io-client'
const socket = io()

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      roomName: '',
    }
  }

  generateRoomName = () => {
    return Math.random().toString(36).substring(7)
  }

  createRoom = (event) => {
    event.preventDefault()
    let roomName = this.generateRoomName()
    this.setState({[event.target.name]: roomName})
    this.props.history.push(`/${roomName}`)
    socket.emit('createdRoom', {name: this.state.name, roomName: roomName})
  }

  joinRoom = (event) => {
    event.preventDefault()
    console.log(
      'NAME: ',
      this.state.name,
      'ROOM: ',
      this.state.roomName,
      'PROPS: ',
      this.props
    )
  }
  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }
  render() {
    const {name, roomName} = this.state

    return (
      <div>
        <form>
          <label htmlFor="name">Name:</label>
          <input
            onChange={this.handleChange}
            type="text"
            id="name"
            name="name"
            value={name}
          />
          <label htmlFor="name">Room:</label>
          <input
            onChange={this.handleChange}
            type="text"
            id="room"
            name="roomName"
            value={roomName}
          />
          <br />

          <input
            onClick={this.joinRoom}
            type="submit"
            value="Join Room"
          ></input>
          <input
            onClick={this.createRoom}
            type="submit"
            name="roomName"
            value="Create Room"
          ></input>
          {/* <Link to={`/room/${this.state.roomName}`}>Link Test</Link> */}
        </form>
        <hr />
      </div>
    )
  }
}
export default HomePage

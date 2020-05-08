import React from 'react'
import {connect} from 'react-redux'
import Room from './room'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      roomName: '',
    }
  }

  joinRoom = (event) => {
    event.preventDefault()
    console.log(this.state.name, 'IM NAME', this.state.roomName)
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
          <input
            onClick={this.joinRoom}
            type="submit"
            value="Join Room"
          ></input>
        </form>
        <hr />
        <Room />
      </div>
    )
  }
}

export default HomePage

import React, {Component} from 'react'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      roomName: '',
    }
  }

  //SUBMIT EVENT FOR CREATING NEW ROOM
  createRoom = (event) => {
    event.preventDefault()
    let roomName = Math.random().toString(36).substring(7)
    this.setState({roomName: roomName})
    this.props.history.push({
      pathname: `/${roomName}`,
      state: {
        name: this.state.name,
      },
    })
  }

  //SUBMIT EVENT FOR JOINING PREEXISTING ROOM
  joinRoom = (event) => {
    event.preventDefault()
    this.props.history.push({
      pathname: `/${this.state.roomName}`,
      state: {
        name: this.state.name,
      },
    })
  }

  //TYPIING IN CONTROLLED COMPONENT
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
        </form>
        <hr />
      </div>
    )
  }
}

export default HomePage

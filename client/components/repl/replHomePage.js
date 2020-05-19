import React, {Component} from 'react'
import './replHomePage.css'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      roomId: '',
    }
  }

  generateroomId = () => {
    return Math.random().toString(36).substring(7)
  }

  createRoom = (event) => {
    event.preventDefault()
    let roomId = this.generateroomId()
    this.setState({[event.target.name]: roomId})
    this.props.history.push({
      pathname: `/${roomId}`,
      state: {
        name: this.state.name,
      },
    })
  }

  joinRoom = (event) => {
    event.preventDefault()
    this.props.history.push({
      pathname: `/${this.state.roomId}`,
      state: {
        name: this.state.name,
      },
    })
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }
  render() {
    const {name, roomId} = this.state

    return (
      <div id="homepage-background">
        <p id="header">
          <a id="inHeader">REPLroom</a>
        </p>
        <div id="form-container">
          <p>
            Welcome to REPLroom, the new app that guarantees a fab coding collab
            experience. <br />
            Before getting started, please enter the following information:
          </p>
          <form>
            <label htmlFor="name">
              <label></label>
              First, {'<input>'} your name here:
            </label>
            <br />
            <input
              onChange={this.handleChange}
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={name}
            />
            <br />
            <br />
            <br />
            {this.state.name.length ? (
              <div id="input fields">
                <label htmlFor="Join Room">
                  if (Room ID === already known) {'{enter it here}'}
                </label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  id="room"
                  name="roomId"
                  placeholder="Room ID"
                  value={roomId}
                />
                <br />
                <input
                  id="joinBtn"
                  className="button"
                  onClick={this.joinRoom}
                  type="submit"
                  value="Join Room"
                ></input>
                <br />
                <br />
                <br />
                <label htmlFor="Create Room">
                  else {'{click below to create a new room}'}
                </label>
                <br />
                <input
                  className="button"
                  onClick={this.createRoom}
                  type="submit"
                  name="roomId"
                  value="Create New Room"
                ></input>
              </div>
            ) : (
              <p id="no-name">
                <em>Please enter your name before proceeding</em>
              </p>
            )}
          </form>
        </div>
      </div>
    )
  }
}

export default HomePage

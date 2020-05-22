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
        <div id="header">
          <img className="titleImg" src="/retroTitle.gif" alt="REPLroom" />
        </div>
        <div id="form-container">
          <p>
            Welcome to REPLroom, the new app that guarantees a fab coding collab
            experience.
            {/*  This is obvious, don't need to say: <br />
            Before getting started, please enter the following information: */}
          </p>
          <form>
            <label htmlFor="name">
              <label></label>
              First, {'<input>'} your name:
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
            {this.state.name.length && this.state.name[0] !== ' ' ? (
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
                {this.state.roomId.length && this.state.roomId[0] !== ' ' ? (
                  <input
                    id="joinBtn"
                    className="button"
                    onClick={this.joinRoom}
                    type="submit"
                    value="Join Room"
                  ></input>
                ) : (
                  <p id="no-name">
                    {/* <em>
                       Redundant: Please enter a valid Room ID to <br /> join an existing room
                    </em> */}
                  </p>
                )}
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
                {/* Reduntant: <em>Please enter your name before proceeding</em> */}
              </p>
            )}
          </form>
        </div>
      </div>
    )
  }
}

export default HomePage

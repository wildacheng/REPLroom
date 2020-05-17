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
      <div>
        <p id="header">
          <a id="inHeader">REPLroom</a>
        </p>
        <div className="login">
          <form>
            <div>
              <div>
                <label htmlFor="name">Name</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                />
              </div>
              <div>
                <label htmlFor="name">Room</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  id="room"
                  name="roomId"
                  value={roomId}
                />
              </div>
              <br />
              <input
                id="joinBtn"
                className="button"
                onClick={this.joinRoom}
                type="submit"
                value="Join Room"
              ></input>
              <input
                className="button"
                onClick={this.createRoom}
                type="submit"
                name="roomId"
                value="Create Room"
              ></input>
            </div>
          </form>
        </div>
        <div id="text">
          <p></p>
          <p>Welcome !</p>
          <p>1. Please fill in name</p>
          <p>2. If you're joining a room please fill in room name</p>
          <p>3. To create a new room just click on create room</p>
        </div>
      </div>
    )
  }
}

export default HomePage

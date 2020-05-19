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
            <label htmlFor="name">Name</label>
            <input
              onChange={this.handleChange}
              type="text"
              id="name"
              name="name"
              value={name}
            />
            <label htmlFor="name">Room</label>
            <input
              onChange={this.handleChange}
              type="text"
              id="room"
              name="roomId"
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
            <input
              className="button"
              onClick={this.createRoom}
              type="submit"
              name="roomId"
              value="Create Room"
            ></input>
          </form>
        </div>
      </div>
    )
  }
}

export default HomePage

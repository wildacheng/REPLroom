import React, {Component} from 'react'
import axios from 'axios'
import {sendEmail} from '../reducer/email'

class InviteByEmail extends Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      email: '',
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  // sendEmail = async () => {
  //   await axios.post('/')
  // }

  render() {
    return (
      <div>
        <label>Enter FirstName: </label>
        <input
          type="text"
          name="firstName"
          value={this.state.firstName}
          onChange={this.handleChange}
        ></input>
        <label>Enter Email: </label>
        <input
          type="text"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
        ></input>
        <button
          type="button"
          onClick={sendEmail({
            firstName: this.state.firstName,
            email: this.state.email,
            url: 'http://localhost:8080/',
            roomId: this.props.roomId,
          })}
        >
          Send
        </button>
      </div>
    )
  }
}

export default InviteByEmail

import React, {Component} from 'react'
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

  handleEmail = () => {
    this.setState({
      firstName: '',
      email: '',
    })
    sendEmail({
      firstName: this.state.firstName,
      email: this.state.email,
      url: 'http://localhost:8080/',
      roomId: this.props.roomId,
    })()
  }

  render() {
    return (
      <div className="email-details">
        <div className="required-fields">
          <label>FirstName </label>
          <span
            className={
              !this.state.firstName.trim() ? 'required-red' : 'required-green'
            }
          >
            (required)
          </span>
        </div>
        <input
          type="text"
          name="firstName"
          placeholder="Enter FirstName"
          value={this.state.firstName}
          onChange={this.handleChange}
          autoFocus
        ></input>
        <div className="required-fields">
          <label>Email </label>
          <span
            className={
              !this.state.email.trim() ? 'required-red' : 'required-green'
            }
          >
            (required)
          </span>
        </div>
        <input
          type="text"
          name="email"
          placeholder="Enter email"
          value={this.state.email}
          onChange={this.handleChange}
        ></input>
        <button
          type="button"
          disabled={!this.state.firstName || !this.state.email}
          onClick={this.handleEmail}
        >
          Send
        </button>
      </div>
    )
  }
}

export default InviteByEmail

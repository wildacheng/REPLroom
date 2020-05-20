import React, {Component} from 'react'
import {sendEmail} from '../reducer/email'
import ToastNotification from '../toastNotification'

class InviteByEmail extends Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      email: '',
      show: false,
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSendEmail = () => {
    sendEmail({
      firstName: this.state.firstName,
      email: this.state.email,
      url: 'http://replroom.herokuapp.com/',
      roomId: this.props.roomId,
    })()
    this.setState({
      firstName: '',
      email: '',
      show: true,
    })
  }

  setShow = (val) => {
    this.setState({
      show: val,
    })
  }

  render() {
    return (
      <div>
        <ToastNotification
          body="Your email has been sent successfully!"
          show={this.state.show}
          setShow={this.setShow}
        />
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
            onClick={this.handleSendEmail}
          >
            Send
          </button>
        </div>
      </div>
    )
  }
}

export default InviteByEmail

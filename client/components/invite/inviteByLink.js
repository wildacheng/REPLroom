import React, {Component} from 'react'

class InviteByLink extends Component {
  // constructor() {
  //   super()
  //   this.state = {
  //     firstName: '',
  //     email: '',
  //   }
  // }

  // handleChange = (e) => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   })
  // }

  // handleShowEmail = () => {
  //   console.log('function called')
  //   sendEmail({
  //     firstName: this.state.firstName,
  //     email: this.state.email,
  //     url: 'http://localhost:8080/',
  //     roomId: this.props.roomId,
  //   })
  // }

  // sendEmail = async () => {
  //   await axios.post('/')
  // }

  render() {
    return (
      <div className="link-details">
        <div>
          <label>URL:</label>
          <label className="info">http://localhost:8080</label>
        </div>
        <div>
          <label>Room:</label>
          <label className="info">{this.props.roomId}</label>
        </div>
      </div>
    )
  }
}

export default InviteByLink

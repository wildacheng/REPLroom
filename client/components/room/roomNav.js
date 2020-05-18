import React, {Component} from 'react'
import Invite from '../invite'
import './roomNav.css'

export default class RoomNav extends Component {
  constructor() {
    super()
    this.state = {
      inviteClicked: false,
    }
  }

  handleInvite = () => {
    this.setState({
      inviteClicked: !this.state.inviteClicked,
    })
  }

  onInviteHide = () => {
    this.setState({
      inviteClicked: false,
    })
  }

  render() {
    let users = this.props.users

    return (
      <div>
        <header>
          <img className="logo" src="/logo.png" alt="logo" />
          <div>
            <div id="activeUser">Person X is typing...</div>
          </div>
          <div className="dropdown">
            <button className="dropbtn headerbtn" type="button">
              Collaborators
            </button>
            <div className="dropdown-content">
              {users.map((user) => (
                <p key={user}>{user}</p>
              ))}
            </div>
          </div>
          <div>
            <button
              type="button"
              className="headerbtn"
              onClick={this.handleInvite}
            >
              Invite
            </button>
            <Invite
              show={this.state.inviteClicked}
              onHide={this.onInviteHide}
              roomId={this.props.roomId}
            />
          </div>
        </header>
      </div>
    )
  }
}

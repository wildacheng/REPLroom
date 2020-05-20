import React, {Component} from 'react'
import {withRouter} from 'react-router'
import Invite from '../invite'
import './roomNav.css'

class RoomNav extends Component {
  constructor(props) {
    super(props)
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
    console.log(this.props, 'IM PROP')

    return (
      <div>
        <header>
          <div className="leftSide">
            <img
              className="logo"
              src="/logo.png"
              alt="logo"
              onClick={() => this.props.history.push('/')}
            />
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

export default withRouter(RoomNav)

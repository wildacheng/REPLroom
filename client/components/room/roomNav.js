import React, {Component} from 'react'
import './roomNav.css'

export default class RoomNav extends Component {
  //keep active collaborators on state to change typing display
  //map (or store) all collaborators on state for display

  render() {
    return (
      <div>
        <header>
          <div className="logo">logo</div>
          <div>
            <div id="activeUser">Person X is typing...</div>
          </div>
          <div className="dropdown">
            <button className="dropbtn" className="headerbtn" type="button">
              Collaborators
            </button>
            <div className="dropdown-content">
              <p>Ruby</p>
              <p>Dakota</p>
              <p>Scout</p>
            </div>
          </div>
          <div>
            <button type="button" className="headerbtn">
              Invite
            </button>
          </div>
        </header>
      </div>
    )
  }
}

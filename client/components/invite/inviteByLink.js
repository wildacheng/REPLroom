import React, {Component} from 'react'

class InviteByLink extends Component {
  render() {
    return (
      <div className="link-details">
        <div>
          <label>URL:</label>
          <label className="info">{`http://replroom.herokuapp.com/${this.props.roomId}`}</label>
        </div>
      </div>
    )
  }
}

export default InviteByLink

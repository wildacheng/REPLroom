import React, {Component} from 'react'
import {Modal} from 'react-bootstrap'
import InviteByEmail from './inviteByEmail'
import InviteByLink from './inviteByLink'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

class Invite extends Component {
  constructor() {
    super()
    this.state = {
      inviteByEmail: false,
      inviteByLink: false,
    }
  }

  handleInviteByEmail = () => {
    this.setState({
      inviteByEmail: !this.state.inviteByEmail,
    })
  }

  handleInviteByLink = () => {
    this.setState({
      inviteByLink: !this.state.inviteByLink,
    })
  }

  render() {
    return (
      <div>
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Choose a method to invite
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <button type="button" onClick={this.handleInviteByEmail}>
                {' '}
                via Email
              </button>
              {this.state.inviteByEmail && (
                <InviteByEmail roomId={this.props.roomId} />
              )}
              <button type="button" onClick={this.handleInviteByLink}>
                {' '}
                via Link
              </button>
              {this.state.inviteByLink && (
                <InviteByLink roomId={this.props.roomId} />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" onClick={this.props.onHide}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Invite

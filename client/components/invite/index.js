import React, {Component} from 'react'
import {Button, Modal} from 'react-bootstrap'
import InviteByEmail from './inviteByEmail'
import './index.css'

class Invite extends Component {
  constructor() {
    super()
    this.state = {
      inviteByEmail: false,
    }
  }

  // componentDidMount = () => {
  //   this.setState({
  //     inviteByEmail: false
  //   })
  // }
  handleInviteByEmail = () => {
    this.setState({
      inviteByEmail: !this.state.inviteByEmail,
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
              <button type="button"> via Link</button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Invite

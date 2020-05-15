import React, {Component} from 'react'
import io from 'socket.io-client'
import socket from '../../socket'
import './index.css'

class TextChat extends Component {
  constructor(props) {
    super()
    this.state = {
      chatOpen: true,
      message: '',
      broadcastedMsg: [],
    }
    // this.socket = io(window.location.origin)

    let room

    if (props.length) room = props.match.params.roomId

    // socket.emit('join-room', room)

    socket.on('chat-message', (message) => {
      console.log('message recieved', message)
      this.setState({
        broadcastedMsg: [...this.state.broadcastedMsg, message],
      })
    })
  }

  handleChat = () => {
    socket.emit('send-chat-message', {
      message: this.state.message,
      roomId: this.props.match.params.roomId,
    })
    this.setState({
      // chatOpen: !this.state.chatOpen,
      message: '',
      broadcastedMsg: [...this.state.broadcastedMsg, this.state.message],
    })
  }

  handleChange = (e) => {
    this.setState({
      message: e.target.value,
    })
  }

  render() {
    return (
      <div className="chat">
        {this.state.chatOpen && (
          <div className="chatbox">
            {this.state.broadcastedMsg.map((msg) => {
              return <div>{msg}</div>
            })}
          </div>
        )}
        <input
          type="text"
          placeholder="Type your message here"
          value={this.state.message}
          onChange={this.handleChange}
        />
        <button type="button" onClick={this.handleChat}>
          {' '}
          Chat{' '}
        </button>
      </div>
    )
  }
}

export default TextChat

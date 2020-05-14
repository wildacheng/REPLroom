import React, {Component} from 'react'
import io from 'socket.io-client'
// const socket = io(window.location.origin)
import socket from '../../socket'
import './index.css'

class Chat extends Component {
  constructor(props) {
    super()
    this.state = {
      chatOpen: false,
      message: '',
      broadcastedMsg: [],
    }

    this.socket = io(window.location.origin)

    const room = props.roomName
    socket.emit('connectToRoom', {roomName: room})

    socket.emit('new-user-joined', props.userName)

    socket.on('chat-message', (data) => {
      this.setState({
        broadcastedMsg: [
          ...this.state.broadcastedMsg,
          {message: data.message, name: data.name},
        ],
      })
    })
  }

  handleChat = () => {
    socket.emit('send-chat-message', {
      message: this.state.message,
      roomId: this.props.roomName,
    })
    this.setState({
      message: '',
      broadcastedMsg: [
        ...this.state.broadcastedMsg,
        {message: this.state.message, name: this.props.userName},
      ],
    })
  }

  handleChange = (e) => {
    this.setState({
      message: e.target.value,
    })
  }

  handleChatWindow = () => {
    this.setState({
      chatOpen: !this.state.chatOpen,
    })
  }

  render() {
    return (
      <div className="chat-pop">
        {this.state.chatOpen && (
          <div className="chat-window">
            <div className="text-area">
              {this.state.broadcastedMsg.map((item) => {
                return <div>{`${item.name}: ${item.message}`}</div>
              })}
            </div>
            <div className="msg-input-bar">
              <input
                type="text"
                placeholder="Type your message here"
                value={this.state.message}
                onChange={this.handleChange}
              />
              <button type="button" onClick={this.handleChat}>
                {' '}
                Send{' '}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="chat-open-button"
          onClick={this.handleChatWindow}
        >
          <img src="../chatV3.png"></img>
        </button>
      </div>
    )
  }
}

export default Chat

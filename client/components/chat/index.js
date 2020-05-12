import React, {Component} from 'react'
import io from 'socket.io-client'
const socket = io(window.location.origin)
import './index.css'

class Chat extends Component {
  constructor() {
    super()
    this.state = {
      chatOpen: true,
      message: '',
      broadcastedMsg: [],
    }
    this.socket = io(window.location.origin)
    socket.on('chat-message', (message) => {
      console.log('message recieved', message)
      // let parent = document.getElementsByClassName('chat')
      // let element = document.getElementsByClassName('chatbox')
      // element.innerText = message;
      // parent.append(element)
      this.setState({
        broadcastedMsg: [...this.state.broadcastedMsg, message],
      })
    })
  }

  handleChat = () => {
    socket.emit('send-chat-message', this.state.message)
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
    console.log('message from state', this.state.message)
    return (
      <div className="chat">
        {this.state.chatOpen && (
          <div className="chatbox">
            {this.state.broadcastedMsg.map((msg) => {
              return <span>{msg}</span>
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

export default Chat

import React, {Component} from 'react'
import io from 'socket.io-client'
const socket = io(window.location.origin)
import './index.css'

class Chat extends Component {
  constructor(props) {
    super()
    this.state = {
      chatOpen: false,
      name: 'Mohana',
      message: '',
      broadcastedMsg: [],
    }

    this.socket = io(window.location.origin)

    const room = props.roomId
    socket.emit('join-room', room)

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
      roomId: this.props.roomId,
    })
    this.setState({
      message: '',
      broadcastedMsg: [...this.state.broadcastedMsg, this.state.message],
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
      // <div className="chat">
      //   <div className="chat-window">
      //     {this.state.chatOpen && (
      //       <div className="chatbox">
      //         {this.state.broadcastedMsg.map((msg) => {
      //           return <div>{msg}</div>
      //         })}
      //         <input
      //           type="text"
      //           placeholder="Type your message here"
      //           value={this.state.message}
      //           onChange={this.handleChange}
      //         />
      //         <button type="button" onClick={this.handleChat}>
      //           {' '}
      //           Send{' '}
      //         </button>
      //       </div>
      //     )}
      //   </div>
      //   <button type="button" className = "chat-open-button" onClick={this.handleChatWindow}>
      //     Chat
      //   </button>
      // </div>
      <div className="chat-pop">
        {/* <div className="chat-window"> */}
        {this.state.chatOpen && (
          <div className="chat-window">
            <div className="text-area">
              {this.state.broadcastedMsg.map((msg) => {
                return <div>{msg}</div>
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
        {/* </div> */}
        <button
          type="button"
          className="chat-open-button"
          onClick={this.handleChatWindow}
        >
          Chat
        </button>
      </div>
    )
  }
}

export default Chat

import React, {Component} from 'react'
import './index.css'

class VideoChat extends Component {
  constructor() {
    super()
    this.state = {
      videoOpen: false,
    }
  }

  handleVideo = () => {
    this.setState({
      videoOpen: !this.state.videoOpen,
    })
  }

  render() {
    return (
      <div className="video">
        {this.state.videoOpen && (
          <div className="">
            <iframe
              src={`https://tokbox.com/embed/embed/ot-embed.js?embedId=e32408e5-28ff-4a88-aa49-bc63b9f55745&room=${this.props.roomId}&iframe=true`}
              width="400px"
              height="300px"
              scrolling="auto"
              allow="microphone; camera"
            ></iframe>
          </div>
        )}
        <div className="video-button">
          <button
            type="button"
            className="video-button"
            onClick={this.handleVideo}
          >
            <img src="/replVid.png"></img>
          </button>
        </div>
      </div>
    )
  }
}

export default VideoChat

import React from 'react'
import Chat from '../chat'
import VideoChat from '../video-chat'

const Communication = (props) => {
  console.log('communication called', props)
  return (
    <div>
      <Chat roomId={props.match.params.roomId} />
      <VideoChat roomId={props.match.params.roomId} />
    </div>
  )
}

export default Communication

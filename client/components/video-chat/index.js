import React from 'react'
import {NavLink} from 'react-router-dom'

const VideoChat = (props) => {
  console.log('PROPS', props)
  let roomId = props.match.params.roomId
  return (
    <div>
      <NavLink to="/roomId/1">
        <iframe
          src={`https://tokbox.com/embed/embed/ot-embed.js?embedId=e32408e5-28ff-4a88-aa49-bc63b9f55745&room=${roomId}&iframe=true`}
          width="400px"
          height="300px"
          scrolling="auto"
          allow="microphone; camera"
        ></iframe>
      </NavLink>
    </div>
  )
}

export default VideoChat

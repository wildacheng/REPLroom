import React from 'react'
import Toast from 'react-bootstrap/Toast'
import 'bootstrap/dist/css/bootstrap.min.css'

const ToastNotification = (props) => {
  const {body, setShow, show} = props
  return (
    <div>
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>{body}</Toast.Body>
      </Toast>
    </div>
  )
}

export default ToastNotification

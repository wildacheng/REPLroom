import React from 'react'

import {Navbar} from './components'
import Repl from './components/repl/repl'
// import Chat from './components/chat'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <Repl />
      {/* <Navbar /> */}
      <Routes />
      {/* <Chat />  */}
    </div>
  )
}

export default App

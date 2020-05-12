import React from 'react'

import {Navbar} from './components'
import Repl from './components/repl/repl'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <Repl />
      <Navbar />
      <Routes />
    </div>
  )
}

export default App

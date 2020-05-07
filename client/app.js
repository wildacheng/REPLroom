import React from 'react'

import {Navbar} from './components'
import Webworkermain from './components/webworkermain'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <Webworkermain />
      <Navbar />
      <Routes />
    </div>
  )
}

export default App

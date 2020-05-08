import React from 'react'

const Worker = () => {
  self.onmessage = function (e) {
    let outputStream = ''
    console.oldLog = console.log
    console.log = function (value) {
      console.oldLog(value)
      outputStream += value
      outputStream += '^+'
    }

    console.oldLog('Message received from main script************', e.data[1])
    let code = e.data[1]

    let f = new Function('return ' + code)()

    try {
      // setTimeout(() => {
      //   console.log('Terminating!!!!!')
      //   self.close();
      // }, 10000)
      f()
    } catch (err) {
      outputStream += err.name
      outputStream += ': ' + err.message
    }

    console.oldLog('Posting message back to main script')
    self.postMessage(outputStream)
  }
}
let code = Worker.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], {type: 'application/javascript'})
const workerScript = URL.createObjectURL(blob)

export default workerScript

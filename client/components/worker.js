import React from 'react'

const Worker = () => {
  self.onmessage = function (e) {
    let outputStream = ''
    console.oldLog = console.log
    console.log = function (value) {
      console.oldLog(value)
      outputStream += value
      outputStream += '\n'
    }

    console.oldLog('Message received from main script************', e.data[1])
    let code = e.data[1]
    // let bodyCode = code;
    // console.log('-------CODE-------', code)
    // let bodyCode = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))
    // console.log('----------BODYCODE---------', bodyCode)
    // let func = new Function('num1', 'num2', code + '')
    // let sum = code.parseFunction()
    let f = new Function('return ' + code)()

    // bodyCode = bodyCode.slice(0, -1)

    f()

    // console.oldLog('--------RESULT FROM NEW FUNC---------', result)
    // var workerResult = 'Received from main: ' + e.data
    console.oldLog('Posting message back to main script')
    self.postMessage(outputStream)
  }
}
let code = Worker.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], {type: 'application/javascript'})
const workerScript = URL.createObjectURL(blob)

export default workerScript

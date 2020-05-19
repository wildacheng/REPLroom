const Worker = () => {
  self.onmessage = function (e) {
    let outputStream = ''
    console.log = function (value) {
      //check if Array.isArray and JSON.stringify it
      outputStream += '  <  '
      outputStream += JSON.stringify(value)
      outputStream += '\n'
    }

    let code = e.data

    let f = new Function('return ' + code)()

    try {
      // setTimeout(() => {
      //   console.log('Terminating!!!!!')
      //   self.close();
      // }, 10000)
      f()
    } catch (err) {
      outputStream += '  <  '
      outputStream += err.name
      outputStream += ': ' + err.message
      outputStream += '\n'
    }
    self.postMessage(outputStream)
  }
}
let code = Worker.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], {type: 'application/javascript'})
const workerScript = URL.createObjectURL(blob)

export default workerScript

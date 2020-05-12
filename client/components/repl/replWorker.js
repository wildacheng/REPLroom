const Worker = () => {
  self.onmessage = function (e) {
    let outputStream = ''
    console.oldLog = console.log
    console.log = function (value) {
      console.oldLog(value)
      outputStream += value
      outputStream += '^+'
    }

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

    self.postMessage(outputStream)
  }
}
let code = Worker.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], {type: 'application/javascript'})
const workerScript = URL.createObjectURL(blob)

export default workerScript

import React, {Component} from 'react'
import {withRouter} from 'react-router'
import SplitPane, {Pane} from 'react-split-pane'
//Code Mirror
import {Controlled as Codemirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
//import 'codemirror/theme/monokai.css'
import 'codemirror/theme/material-palenight.css'
import 'codemirror/mode/javascript/javascript.js' //look into this
//local scripts
import workerScript from './replWorker'
import WorkerOutput from './replTerminal'
import parseCode from './parser'
//CSS
import './repl.css'

const TIMEOUT = 8000

class Repl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: '65%', //height of the editor
    }
  }

  handleTerminal = (data) => {
    return <WorkerOutput output={data} />
  }

  functionWrapper = (str) => {
    // eslint-disable-next-line no-new-func
    return new Function(str).toString()
  }

  handleWebWorker = () => {
    const myWorker = new Worker(workerScript)

    myWorker.onmessage = (m) => {
      // this.setState({result: m.data})
      this.props.updateResult(m.data)
    }

    const parsedCode = parseCode(this.props.code)
    myWorker.postMessage([typeof f, this.functionWrapper(parsedCode)])

    setTimeout(() => {
      myWorker.terminate()
    }, TIMEOUT)
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'material-palenight',
      viewportMargin: Infinity,
    }

    return (
      <SplitPane
        split="horizontal"
        minSize={5}
        maxSize={-5}
        defaultSize={this.state.height}
      >
        <Pane className="pane">
          <Codemirror
            value={this.props.code}
            options={options}
            onBeforeChange={(_editor, _data, value) => {
              this.props.updateCode(value)
            }}
          />
        </Pane>
        <Pane className="pane">
          <WorkerOutput
            output={this.props.result}
            handleRun={this.handleWebWorker}
          />
        </Pane>
      </SplitPane>
    )
  }
}

export default withRouter(Repl)

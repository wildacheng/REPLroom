import React from 'react'
import {Controlled as Codemirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/gruvbox-dark.css'
import 'codemirror/mode/javascript/javascript.js' //look into this
import '../repl/repl.css'

const WorkerOutput = (props) => {
  const options = {
    lineNumbers: false,
    mode: 'javascript',
    theme: 'gruvbox-dark',
    readOnly: 'nocursor',
    viewportMargin: Infinity,
  }

  const {output, handleRun} = props

  return (
    <div>
      <button className="runbtn" type="button" onClick={handleRun}>
        Run
      </button>
      <Codemirror
        className="output"
        value={output.length > 1 ? output + '  < _' : '  < _'}
        options={options}
      />
    </div>
  )
}

export default WorkerOutput

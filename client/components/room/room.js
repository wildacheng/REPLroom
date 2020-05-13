import React, {Component} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
import RoomNav from './roomNav'
import Repl from '../repl/repl'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: '50%', //width of left pane
    }
  }

  render() {
    return (
      <div>
        <RoomNav />
        <SplitPane
          split="vertical"
          minSize={5}
          maxSize={-5}
          defaultSize={this.state.width}
        >
          <Repl />
          <Pane className="pane">
            <div> WHITEBOARD</div>
          </Pane>
        </SplitPane>
      </div>
    )
  }
}

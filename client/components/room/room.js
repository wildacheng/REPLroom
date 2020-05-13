import React, {Component} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
import RoomNav from './roomNav'
import Repl from '../repl/repl'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: '45%', //width of left pane
    }
  }

  render() {
    return (
      <div>
        <RoomNav />
        <SplitPane split="vertical" minSize={50} defaultSize={this.state.width}>
          <Repl />
          <Pane className="pane">
            <div> WHITEBOARD</div>
          </Pane>
        </SplitPane>
      </div>
    )
  }
}

import React from "react"
import { connect } from "react-redux"
import Actions from "actions/world"
import History from "components/History"
import Blocks from "components/Blocks"
import CommandBar from "components/CommandBar"

import "./styles.css"

class BlocksWorld extends React.Component {
  static propTypes = {
    world: React.PropTypes.object,
    dispatch: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    this.defaultState = []

    this.state = { selectedResp: 0, status: "try" }
  }

  componentDidMount() {
    this.props.dispatch(Actions.pushToHistory({ text: "initial", value: this.defaultState }))
  }

  handleQuery(query) {
    if (this.state.status === "try") {
      const r = this.props.dispatch(Actions.tryQuery(query))
      if (r) this.setState({ status: "accept" })
    } else if (this.state.status === "accept") {
      const r = this.props.dispatch(Actions.accept(query, this.state.selectedResp))
      if (r) this.setState({ status: "try" })
    } else {
      console.log("uh oh...")
    }
  }

  handleStatusChange(newStatus) {
    this.setState({ status: newStatus })
  }

  render() {
    const { responses, history } = this.props.world
    // const history = [{text: "add 6 red"}, {text: "add 3 orange"}, {text: "add orange"}, {text: "add red"}, {text: "initial"}]
    // const currentState = [{x: 0, y: 0, z: 0, color: "Red", names: []}, {x: -1, y: 0, z: 0, color: "Blue", names: []}, {x: 0, y: 0, z: 1, color: "Orange", names: []}]
    let currentState = this.defaultState

    console.log(history)

    if (this.state.status === "accept" && responses.length > 0) {
      currentState = responses[this.state.selectedResp].value
    } else {
      if (history.length > 0)
        currentState = history[history.length - 1].value
    }

    return (
      <div className="BlocksWorld">
        <div className="BlocksWorld-left">
          {/* <History history={history} /> */}
        </div>
        <div className="BlocksWorld-mainblocks">
          <Blocks blocks={currentState} width={1650} height={1200} />
          <CommandBar
            query={(query) => this.handleQuery(query) }
            changeStatus={(newStatus) => this.handleStatusChange(newStatus)}
            status={this.state.status}
          />
        </div>
        <div className="BlocksWorld-right">
          hello
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  world: state.world
})

export default connect(mapStateToProps)(BlocksWorld)

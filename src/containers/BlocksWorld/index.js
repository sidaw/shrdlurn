import React from "react"
import { connect } from "react-redux"
import classnames from "classnames"
import Actions from "actions/world"
import History from "components/History"
import Blocks from "components/Blocks"
import CommandBar from "components/CommandBar"
import Target from "components/Target"
import { genRandomTarget } from "helpers/util"
import { sortBlocks } from "helpers/blocks"

import "./styles.css"

class BlocksWorld extends React.Component {
  static propTypes = {
    world: React.PropTypes.object,
    dispatch: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    this.defaultState = [{ x: 0, y: 0, z: 0, color: "Red", names: ["S"] }]

    this.state = { selectedResp: 0, status: "try", targetIdx: -1, target: [], possSteps: Infinity }
  }

  componentDidMount() {
    this.props.dispatch(Actions.pushToHistory({ text: "initial", value: this.defaultState }))
    const randomTarget = genRandomTarget()
    this.setState({ target: randomTarget[2], possSteps: randomTarget[1], targetIdx: randomTarget[0] })
  }

  handleQuery(query) {
    if (this.state.status === "try") {
      const r = this.props.dispatch(Actions.tryQuery(query))
      if (r) this.setState({ status: "accept" })
    } else if (this.state.status === "accept") {
      /* TODO:  Win check! */
      const r = this.props.dispatch(Actions.accept(query, this.state.selectedResp))
      if (r) this.setState({ status: "try", selectedResp: 0 })
    } else {
      console.log("uh oh...")
    }
  }

  handleStatusChange(newStatus) {
    this.setState({ status: newStatus })
  }

  stateIncludes(state, obj) {
    for (const c of state) {
      if (c.x === obj.x &&
          c.y === obj.y &&
          c.z === obj.z &&
          c.color === obj.color) {
        return true;
      }
    }
    return false;
  }

  computeDiff(state, newState) {
    const difference = newState.filter(c => !this.stateIncludes(state, c));
    const intersection = newState.filter(c => this.stateIncludes(state, c));

    return difference.map((c) => (Object.assign({}, c, { names: [...c.names, "_new"] })))
      .concat(intersection);
  }

  equalityCheck(struct1, struct2) {
    const a = sortBlocks(struct1).filter((b) => b.color !== "Anchor");
    const b = sortBlocks(struct2).filter((b) => b.color !== "Anchor");

    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i].x !== b[i].x ||
          b[i].y !== b[i].y ||
          b[i].z !== b[i].z ||
          b[i].color !== b[i].color) {
        return false;
      }
    }
    return true;
  }

  upSelected() {
    const selectedResp = this.state.selectedResp
    if (selectedResp < this.props.world.responses.length - 1)
      this.setState({ selectedResp: selectedResp + 1 })
  }

  downSelected() {
    const selectedResp = this.state.selectedResp
    if (selectedResp > 0)
      this.setState({ selectedResp: selectedResp - 1 })
  }

  render() {
    const { responses, history } = this.props.world
    // const history = [{text: "add 6 red"}, {text: "add 3 orange"}, {text: "add orange"}, {text: "add red"}, {text: "initial"}]
    // const currentState = [{x: 0, y: 0, z: 0, color: "Red", names: []}, {x: -1, y: 0, z: 0, color: "Blue", names: []}, {x: 0, y: 0, z: 1, color: "Orange", names: []}]
    let currentState = this.defaultState

    if (this.state.status === "accept" && responses.length > 0) {
      currentState = this.computeDiff(history[history.length - 1].value || [], responses[this.state.selectedResp].value)
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
          <div className="BlocksWorld-status">
            <div className={classnames("BlocksWorld-statusmsg", {"active": this.state.status === "accept"})}>
              <span>{this.state.selectedResp + 1} / {responses.length} possible interpretations</span>
              <div className="BlocksWorld-buttons">
                <button onClick={() => this.upSelected()}>&uarr;</button>
                <button onClick={() => this.downSelected()}>&darr;</button>
              </div>
            </div>
          </div>
          <CommandBar
            query={(query) => this.handleQuery(query) }
            changeStatus={(newStatus) => this.handleStatusChange(newStatus)}
            onUp={() => this.upSelected()}
            onDown={() => this.downSelected()}
            status={this.state.status}
          />
        </div>
        <div className="BlocksWorld-right">
          <Target target={this.state.target} possibleSteps={this.state.possSteps} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  world: state.world
})

export default connect(mapStateToProps)(BlocksWorld)

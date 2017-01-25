import React from "react"
import { connect } from "react-redux"
import classnames from "classnames"
import Actions from "actions/world"
import Logger from "actions/logger"
import History from "components/History"
import Blocks from "components/Blocks"
import CommandBar from "components/CommandBar"
import Target from "components/Target"
import SharePanel from "components/SharePanel"
import Win from "components/Win"
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

    this.defaultState = [{ x: 0, y: 0, z: 0, color: "Fake", names: ["S"] }]

    this.state = { selectedResp: 0, targetIdx: -1, target: [], possSteps: Infinity, win: false }
    this.maxSteps = () => this.state.possSteps * 3
  }

  componentDidMount() {
    const randomTarget = genRandomTarget()
    this.setState({ target: randomTarget[2], possSteps: randomTarget[1], targetIdx: randomTarget[0] })

    this.props.dispatch(Logger.log({ type: "start", msg: { targetIdx: randomTarget[0], target: randomTarget[2] }}))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.world.status === "accept" && nextProps.world.status === "define") {
      this.handleQuery(this.props.world.query)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.world.history.length > 0 && this.equalityCheck(this.props.world.history[this.props.world.history.length - 1].value, this.state.target)) {
      /* WIN! */
      this.win()
    }
  }

  win() {
    if (!this.state.win) {
      this.props.dispatch(Logger.log({ type: "win", msg: { steps: this.props.world.history.length } }))
      this.setState({ win: true })
    }
  }

  handleQuery(query) {
    if (this.props.world.status === "try") {
      this.props.dispatch(Actions.tryQuery(query))
        .then(r => {
          if (!r) {
            /* Try query unsuccessful, set it as a pin */
            this.props.dispatch(Actions.setPin())
            this.props.dispatch(Actions.resetResponses())
            this.props.dispatch(Actions.setQuery(""))
            this.setState({ selectedResp: 0 })
          } else {
            this.setState({ selectedResp: 0 })
            // this.setState({ shouldDefine: false })
          }
        })
    } else if (this.props.world.status === "accept") {
      /* Max steps check */
      if (this.props.world.history.length >= this.maxSteps) {
        alert("You've reached the maximum number of steps, undo some steps in order to add more.")
        this.setState({ selectedResp: 0 })
        return
      }

      /* Otherwise, just accept normally */
      const r = this.props.dispatch(Actions.accept(query, this.state.selectedResp))

      if (r) {
        this.setState({ selectedResp: 0 })
      }
    } else if (this.props.world.status === "define") {
      this.props.dispatch(Actions.define(this.props.world.defineN))
    } else if (this.props.world.status === "loading") {
      this.props.dispatch(Actions.setStatus("try"))
    } else {
      console.log("uh oh...")
    }
  }

  handleStatusChange(newStatus) {
    this.props.dispatch(Actions.setStatus(newStatus))
    this.setState({ selectedResp: 0 })
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
          a[i].y !== b[i].y ||
          a[i].z !== b[i].z ||
          a[i].color !== b[i].color) {
        return false;
      }
    }

    return true;
  }

  upSelected() {
    const selectedResp = this.state.selectedResp
    if (selectedResp < this.props.world.responses.length - 1) {
      this.setState({ selectedResp: selectedResp + 1 })
      this.props.dispatch(Logger.log({ type: "scroll", msg: { dir: "up" }}))
    } else {
      // this.setState({ selectedResp: 0 })
      // this.props.dispatch(Actions.openDefine())
      // this.props.dispatch(Actions.resetResponses())
    }
  }

  downSelected() {
    const selectedResp = this.state.selectedResp
    if (selectedResp > 0) {
      this.setState({ selectedResp: selectedResp - 1 })
      this.props.dispatch(Logger.log({ type: "scroll", msg: { dir: "down" }}))
    }

    // if (this.props.world.defining && selectedResp === this.props.world.responses.length - 1) {
    //   this.props.dispatch(Actions.closeDefine())
    // }
  }

  closeDefine() {
    this.props.dispatch(Actions.closeDefine())
  }

  handleShiftClick() {
    const { history, defining } = this.props.world
    if (defining) return
    /* Find last pin to define */
    const idx = history.slice().reverse().findIndex(h => h.type === "pin")
    if (idx !== -1) {
      this.props.dispatch(Actions.define(history.length - 1 - idx))
    } else {
      alert("not")
    }
  }

  render() {
    const { world: { responses, history, current_history_idx, status, defining }, task } = this.props


    /* Compute the currentState of blocks by finding which history item is
     * currently selected (by default, the latest one), and then computing
     * the diff between the selected candidate's response if in 'try' mode */
    let currentState = this.defaultState
    const idx = current_history_idx >= 0 ? current_history_idx : history.length - 1

    if (this.props.world.status === "accept" && responses.length > 0) {
      try {
        /* If there is an error on this selection, pop up with an alert and print
         * the error to the console */
        if (responses[this.state.selectedResp].error) {
          alert("This response resulted in an error with our server. Please scroll to another intepretation or try another query. The error message was: " + responses[this.state.selectedResp].error)
        }
        currentState = this.computeDiff(history[idx].value || [], responses[this.state.selectedResp].value)
      } catch (e) {
        currentState = this.computeDiff(history[idx].value || [], responses[0].value)
      }
    } else {
      if (history.length > 0) {
        try {
          currentState = history[idx].value
        } catch (e) {
          currentState = history[history.length - 1].value
        }
      }
    }

    /* Figure out the proper status message from the world's status */
    let statusMsg = <span>Enter a command for the computer.<br /></span>
    if (status === "accept") {
      statusMsg = <span>Click accept if the computer correctly intepreted what you meant, scroll to see other intepretations, or revise your command.</span>
    } else if (defining) {
      statusMsg = <span><strong>Define</strong> the highlighted set of actions as this phrase (e.g. build a chair):</span>
    }

    return (
      <div className="BlocksWorld">
        <div className="BlocksWorld-mainblocks">
          <Blocks blocks={currentState} width={1650} height={1200} isoConfig={{canvasWidth: 1650, canvasHeight: 1200, numUnits:30}}/>
        </div>
        <div className="BlocksWorld-command">
          <History />
          <CommandBar
            query={this.props.world.query}
            changeQuery={(q) => this.props.dispatch(Actions.setQuery(q))}
            handleQuery={(query) => this.handleQuery(query) }
            changeStatus={(newStatus) => this.handleStatusChange(newStatus)}
            onUp={() => this.upSelected()}
            onDown={() => this.downSelected()}
            status={this.props.world.status}
            defining={this.props.world.defining}
            handleShiftClick={() => this.handleShiftClick()}
          />
          <div className="BlocksWorld-status">
            {statusMsg}
            <div className={classnames("BlocksWorld-statusmsg", {"active": this.props.world.status === "accept" && responses.length > 0})}>
              <span>{this.state.selectedResp + 1} / {responses.length} possible interpretations</span>
              <div className="BlocksWorld-buttons">
                <button onClick={() => this.upSelected()}>&uarr;</button>
                <button onClick={() => this.downSelected()}>&darr;</button>
              </div>
            </div>
            {this.props.world.defining &&
              <button onClick={() => this.closeDefine()} className="BlocksWorld-definecancel">Cancel Define</button>
            }
          </div>
        </div>
        {task === "target" ?
          <Target target={this.state.target} possibleSteps={this.state.possSteps} />
        :
          <SharePanel score={this.props.score} />
        }
        {this.state.win &&
          <Win targetIdx={this.state.targetIdx} nSteps={history.length} nBlocks={currentState.length} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  world: state.world,
  task: state.user.task,
  score: state.logger.score
})

export default connect(mapStateToProps)(BlocksWorld)

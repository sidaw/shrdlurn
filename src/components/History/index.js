import React from "react"
import classnames from "classnames"
import { connect } from "react-redux"
import Actions from "actions/world"

import "./styles.css"

class History extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,
    shouldDefine: React.PropTypes.bool,

    dispatch: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = { defineN: Infinity, squashing: false, newdefiner: "" }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.shouldDefine && !this.props.shouldDefine && !this.state.squashing) {
      this.setState({ squashing: true, defineN: this.props.history.length + 1, newdefiner: this.props.query })
    }
  }

  handleDefine() {
    if (this.state.newdefiner.length === 0) {
      alert("You cannot define something as nothing!")
      return
    }

    this.props.dispatch(Actions.define(this.state.newdefiner, this.state.defineN))
    this.setState({ defineN: Infinity, squashing: false, newdefiner: "" })
    /* TODO: reject definitions? */
  }

  renderHistory() {
    const { history, current_history_idx } = this.props

    const historyItems = history.slice()

    return historyItems.reverse().map((h, idx) => {
      const stepN = this.props.history.length - idx
      return (
        <div key={idx} className={classnames("History-row", {"active": current_history_idx === stepN - 1, "squashing": this.state.squashing && stepN >= this.state.defineN, "lastsquasher": this.state.squashing && stepN === this.state.defineN})}>
          <div className="History-item" onClick={() => this.props.dispatch(Actions.revert(stepN - 1))} onDoubleClick={() => this.props.dispatch(Actions.setQuery(h.text))}>
            <div
              className="History-item-num"
              onMouseEnter={() => { if (!this.state.squashing) this.setState({ defineN: stepN })}}
              onMouseLeave={() => { if (!this.state.squashing) this.setState({ defineN: Infinity }) }}
              onClick={(e) => { e.stopPropagation(); this.setState({ squashing: true })}}
            >
              {(() => {
                if (stepN >= this.state.defineN) {
                  return <div className="History-item-num-squashing"></div>
                } else {
                  return <span>{stepN}</span>
                }
              })()}
            </div>
            <div className="History-item-text">{h.text}</div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="History">
        <h2>History</h2>
        {(() => {
          if (this.state.squashing) {
            return (
              <div key="squash" className={classnames("History-row", "squashing", "History-row-squasher", {"lastsquasher": this.state.defineN > this.props.history.length && !(this.props.query !== "" && this.props.status === "accept")})}>
                <div className="History-row-squasher-label">define this set of actions as:</div>
                <input type="text" className="History-row-squasher-input" ref="squasher" placeholder="(e.g. build a chair, add red on all sides)" value={this.state.newdefiner} onChange={(e) => this.setState({newdefiner:e.target.value})} />
                <button className="active" onClick={() => this.handleDefine()}>Define</button>
                <button onClick={() => this.setState({ defineN: Infinity, squashing: false, newdefiner: "" })}>Cancel</button>

                <div className="History-row-squasher-endlabel">(you can keep adding to this set...)</div>
              </div>
            )
          }
        })()}
        <div className="History-rows">
          {(() => {
            if (this.props.query !== "" && this.props.status === "accept") {
              return (
                <div key="temp" className={classnames("History-row", "next", {"squashing": this.state.squashing, "lastsquasher": this.state.squashing && this.state.defineN > this.props.history.length})}>
                  <div className="History-item">
                    <div className="History-item-num">{this.props.history.length + 1}</div>
                    <div className="History-item-text">{this.props.query}</div>
                  </div>
                </div>
              )
            }
          })()}
          {this.renderHistory()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  history: state.world.history,
  current_history_idx: state.world.current_history_idx,
  query: state.world.query,
  status: state.world.status
})

export default connect(mapStateToProps)(History)

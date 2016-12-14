import React from "react"
import classnames from "classnames"
import { connect } from "react-redux"
import Actions from "actions/world"

import "./styles.css"

class History extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,
    defining: React.PropTypes.bool,

    dispatch: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = { defineN: Infinity, newdefiner: "" }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.defining && !this.props.defining && this.state.defineN === Infinity) {
      this.setState({ defineN: this.props.history.length + 1, newdefiner: this.props.query })
    } else if (!newProps.defining && this.props.defining) {
      this.setState({ defineN: Infinity })
    }
  }

  handleDefine() {
    if (this.state.newdefiner.length === 0) {
      alert("You cannot define something as nothing!")
      return
    }

    this.props.dispatch(Actions.define(this.state.newdefiner, this.state.defineN))
    this.setState({ defineN: Infinity, newdefiner: "" })
    this.props.dispatch(Actions.closeDefine)
    /* TODO: how to reject definitions? */
  }

  setPin() {
    this.props.dispatch(Actions.setPin())
  }

  openDefine(e, stepN, h, idx) {
    e.stopPropagation()
    if (h.type !== "pin") {
      this.setState({ defineN: stepN })
    } else {
      this.setState({ newdefiner: h.text, defineN: stepN })
      this.props.dispatch(Actions.removePin(stepN - 1))
    }

    this.props.dispatch(Actions.openDefine())
  }

  renderHistory() {
    const { history, current_history_idx } = this.props

    const historyItems = history.slice().reverse()

    const topPinIdx = historyItems.findIndex((el) => el.type === "pin")

    return historyItems.map((h, idx) => {
      const stepN = this.props.history.length - idx
      return (
        <div key={idx} className={classnames("History-row", {"active": current_history_idx === stepN - 1, "squashing": this.props.defining && stepN >= this.state.defineN, "lastsquasher": this.props.defining && stepN === this.state.defineN, "pin": h.type === "pin"})}>
          <div className="History-item" onClick={() => this.props.dispatch(Actions.revert(stepN - 1))} onDoubleClick={() => { this.props.dispatch(Actions.setQuery(h.text)); console.log(h) }}>
            <div
              className="History-item-num"
              onMouseEnter={() => { if (!this.props.defining && (topPinIdx === -1  || idx <= topPinIdx)) this.setState({ defineN: stepN })}}
              onMouseLeave={() => { if (!this.props.defining && (topPinIdx === -1 || idx <= topPinIdx)) this.setState({ defineN: Infinity }) }}
              onClick={(e) => { if (topPinIdx === -1 || idx <= topPinIdx) { this.openDefine(e, stepN, h, idx) } }}
            >
              {(() => {
                if (stepN >= this.state.defineN) {
                  return <div className={classnames("History-item-num-squashing", {"last": stepN === this.state.defineN})}>{stepN}</div>
                } else {
                  return <span>{stepN}</span>
                }
              })()}
            </div>
            <div className="History-item-text">
              {h.text}
              {h.type === "pin" &&
                <div className="History-item-deletepin" onClick={() => this.props.dispatch(Actions.removePin(stepN - 1))}>&times;</div>
              }
            </div>
          </div>
          {(() => {
            if (this.props.defining && stepN === this.state.defineN) {
              return (
                <div className="History-defbuttons">
                  <button className="active" onClick={() => this.handleDefine()}>Finish Definition</button>
                  <button onClick={() => { this.setState({ defineN: Infinity, newdefiner: "" }); this.props.dispatch(Actions.closeDefine()) }}>Cancel</button>
                </div>
              )
            }
          })()}
        </div>
      )
    })
  }

  render() {
    return (
      <div className="History">
        <h2>History</h2>
        <button className={classnames("History-openDefine", {"active": this.props.defining})} onClick={() => { this.props.dispatch(Actions.openDefine()) }}>Define</button>
        {(() => {
          if (this.props.defining) {
            return (
              <div className="History-rows-squash-container">
                <div key="squash" className={classnames("History-row", "squashing", "History-row-squasher", {"lastsquasher": this.state.defineN > this.props.history.length && !(this.props.query !== "" && this.props.status === "accept")})}>
                  <div className="History-row-squasher-close" onClick={() => { this.setState({ defineN: Infinity, newdefiner: "" }); this.props.dispatch(Actions.closeDefine()) }}>&times;</div>
                  <div className="History-row-squasher-label">define this:</div>
                  <input type="text" className="History-row-squasher-input" ref="squasher" placeholder="(e.g. build a chair, add red on all sides)" value={this.state.newdefiner} onChange={(e) => this.setState({newdefiner:e.target.value})} />
                  <div className="History-row-squasher-sublabel">as this set of actions:</div>
                  {this.state.defineN - 1 === this.props.history.length && !(this.props.query !== "" && this.props.status === "accept") &&
                    <span className="History-row-squasher-subsublabel">(no actions yet)</span>
                  }
                </div>
              </div>
            )
          }
        })()}
        <div className="History-rows">
          {(() => {
            if (this.props.query !== "" && this.props.status === "accept") {
              return (
                <div key="temp" className={classnames("History-row", "next", {"squashing": this.props.defining, "lastsquasher": this.props.defining && this.state.defineN > this.props.history.length})} onClick={() => this.setPin()}>
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
  status: state.world.status,
  defining: state.world.defining
})

export default connect(mapStateToProps)(History)

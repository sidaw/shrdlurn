import React from "react"
import classnames from "classnames"
import { connect } from "react-redux"
import Actions from "actions/world"

import "./styles.css"

class History extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,

    dispatch: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = { defineSpacer: null, newdefiner: "" }
  }

  addSpacer(idx) {
    this.setState({ defineSpacer: idx })
  }

  renderHistory() {
    const { history, current_history_idx } = this.props

    const historyItems = history.slice()

    return historyItems.reverse().map((h, idx) => {
      const stepN = this.props.history.length - idx
      return (
        <div key={idx} className={classnames("History-row", {"active": current_history_idx === stepN - 1})}>
          <div className="History-item" onClick={() => this.props.dispatch(Actions.revert(stepN - 1))}>
            <div className="History-item-num">{stepN}</div>
            <div className="History-item-text">{h.text}</div>
          </div>
        </div>
      )
    })


    // return this.state.history.map((h, idx) => {
    //   const defining = this.state.defineSpacer != null && idx < this.state.defineSpacer ? true : false
    //   return (
    //     <div key={idx} className={classnames("History-row", {"defining": defining })}>
    //       {(() => {
    //         if (this.state.defineSpacer == null) {
    //           return (<div className="History-addSpacer" onClick={(e) => this.addSpacer(idx)} />)
    //         }
    //       })()}
    //       <div className="History-item">
    //         {this.state.history.length - idx}.&nbsp;
    //         {h.text}
    //       </div>
    //     </div>
    //   )
    // })
  }

  handleDefinition() {
    const history = this.state.history.slice(this.state.defineSpacer, this.state.history.length)
    history.unshift({"text": this.state.newdefiner})
    this.setState({ history: history, defineSpacer: null, newdefiner: ""})
  }

  render() {
    return (
      <div className="History">
        <h2>History</h2>
        {(() => {
          if (this.state.defineSpacer != null) {
            return (
              <div key="adder" className="History-row">
                <input type="text" placeholder="define the new step" value={this.state.newdefiner} onChange={(e) => this.setState({newdefiner: e.target.value})} style={{fontSize:"1.4rem"}}/>
                <div className="History-define-buttons">
                  <button onClick={() => { this.handleDefinition() }}>√</button>
                  <button onClick={() => { this.setState({ defineSpacer: null })}}>X</button>
                </div>
              </div>
            )
          }
        })()}
        <div className="History-rows">
          {(() => {
            if (this.props.currentQuery !== "") {
              return (
                <div key="temp" className="History-row next">
                  <div className="History-item">
                    <div className="History-item-num">{this.props.history.length + 1}</div>
                    <div className="History-item-text">{this.props.currentQuery}</div>
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
  current_history_idx: state.world.current_history_idx
})

export default connect(mapStateToProps)(History)

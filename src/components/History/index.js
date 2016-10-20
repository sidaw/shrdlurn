import React from "react"
import classnames from "classnames"

import "./styles.css"

class History extends React.Component {
  constructor(props) {
    super(props)

    this.state = { defineSpacer: null, history: props.history, newdefiner: "" }
  }

  addSpacer(idx) {
    this.setState({ defineSpacer: idx })
  }

  renderHistory() {
    return this.state.history.map((h, idx) => {
      const defining = this.state.defineSpacer != null && idx < this.state.defineSpacer ? true : false
      return (
        <div key={idx} className={classnames("History-row", {"defining": defining })}>
          {(() => {
            if (this.state.defineSpacer == null) {
              return (<div className="History-addSpacer" onClick={(e) => this.addSpacer(idx)} />)
            }
          })()}
          <div className="History-item">
            {this.state.history.length - idx}.&nbsp;
            {h.text}
          </div>
        </div>
      )
    })
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
        {this.renderHistory()}
      </div>
    )
  }
}

export default History

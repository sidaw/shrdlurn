import React from "react"
import classnames from "classnames"

import "./styles.css"

class CommandBar extends React.Component {
  static propTypes = {
    buttonText: React.PropTypes.string,
    status: React.PropTypes.string,
    handleQuery: React.PropTypes.func,
    query: React.PropTypes.string,
    changeQuery: React.PropTypes.func,
    onUp: React.PropTypes.func,
    onDown: React.PropTypes.func,
    changeStatus: React.PropTypes.func,
    defining: React.PropTypes.bool,
    exampleQuery: React.PropTypes.string
  }

  handleChange(e) {
    this.props.changeQuery(e.target.value)

    if (this.props.status === "accept")
      this.props.changeStatus("try")
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleClick()
    } else if (e.keyCode === 40) {
      e.preventDefault()
      this.props.onUp()
    } else if (e.keyCode === 38) {
      e.preventDefault()
      this.props.onDown()
    }
  }

  handleClick() {
    if (this.props.query.length === 0) return

    this.props.handleQuery(this.props.query)
    if (this.props.status === "accept")
      this.props.changeQuery("")
  }

  render() {
    const active = this.props.status === "try" && this.props.query.length > 0
    const accepting = this.props.status === "accept"

    let statusMsg = <span>Enter a command for the computer.<br /><strong>Example query:</strong> {this.props.exampleQuery}</span>
    if (this.props.status === "accept") {
      statusMsg = <span>Click accept if the computer correctly intepreted what you meant, scroll to see other intepretations, or revise your command.</span>
    } else if (this.props.defining) {
      statusMsg = <span>Enter a command to add to the <strong>current definition</strong>. You can only accept things that the computer understands.</span>
    }

    return (
      <div className="CommandBar">
        <input
          type="text"
          ref="commandbar"
          placeholder="Tell the computer what to do..."
          value={this.props.query}
          onChange={(e) => this.handleChange(e)}
          onKeyDown={(e) => this.handleKeyDown(e) }
        />
        <button
          className={classnames({"active": active || accepting, "accepting": accepting})}
          onClick={() => this.handleClick() }
        >
          {this.props.status}
        </button>
        <div className="CommandBar-status">
          {statusMsg}
        </div>
      </div>
    )
  }
}

export default CommandBar

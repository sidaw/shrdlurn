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
    const { status, query } = this.props
    const active = status === "try" && query.length > 0
    const accepting = status === "accept" || status === "define"

    const placeholder = status !== "define" ? "Tell the computer what to do..." : "Define this set of actions as..."

    return (
      <div className="CommandBar">
        <input
          type="text"
          ref="commandbar"
          placeholder={placeholder}
          value={query}
          onChange={(e) => this.handleChange(e)}
          onKeyDown={(e) => this.handleKeyDown(e) }
        />
        <button
          className={classnames({"active": active || accepting, "accepting": accepting})}
          onClick={() => this.handleClick() }
        >
          {status}
        </button>
      </div>
    )
  }
}

export default CommandBar

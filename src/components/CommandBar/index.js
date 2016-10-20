import React from "react"
import classnames from "classnames"

import "./styles.css"

class CommandBar extends React.Component {
  static propTypes = {
    buttonText: React.PropTypes.string,
    status: React.PropTypes.string,
    query: React.PropTypes.func,
    onUp: React.PropTypes.func,
    onDown: React.PropTypes.func,
    changeStatus: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = { command: "" }
  }

  handleChange(e) {
    this.setState({ command: e.target.value })

    if (this.props.status === "accept")
      this.props.changeStatus("try")
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleClick()
    } else if (e.keyCode === 38) {
      e.preventDefault()
      this.props.onUp()
    } else if (e.keyCode === 40) {
      e.preventDefault()
      this.props.onDown()
    }
  }

  handleClick() {
    if (this.state.command.length === 0) return

    this.props.query(this.state.command)
    if (this.props.status === "accept")
      this.setState({ command: "" })
  }

  render() {
    const active = this.props.status === "try" && this.state.command.length > 0
    const accepting = this.props.status === "accept"

    return (
      <div className="CommandBar">
        <input
          type="text"
          ref="commandbar"
          placeholder="Tell the computer what to do..."
          value={this.state.command}
          onChange={(e) => this.handleChange(e)}
          onKeyDown={(e) => this.handleKeyDown(e) }
        />
        <button
          className={classnames({"active": active || accepting, "accepting": accepting})}
          onClick={() => this.handleClick() }
        >
          {this.props.status}
        </button>
      </div>
    )
  }
}

export default CommandBar

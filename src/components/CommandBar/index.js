import React from "react"
import classnames from "classnames"

import "./styles.css"

class CommandBar extends React.Component {
  static propTypes = {
    buttonText: React.PropTypes.string,
    status: React.PropTypes.string,
    query: React.PropTypes.func,
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
    if (e.keyCode === 13)
      this.handleClick()
  }

  handleClick() {
    this.props.query(this.state.command)
  }

  render() {
    const active = ((this.props.status === "try" && this.state.command.length > 0) || (this.props.status === "accept")) ? true : false

    return (
      <div className="CommandBar">
        <input
          type="text"
          placeholder="Tell the computer what to do..."
          value={this.state.command}
          onChange={(e) => this.handleChange(e)}
          onKeyDown={(e) => this.handleKeyDown(e) }
        />
        <button
          className={classnames({"active": active})}
          onClick={() => this.handleClick() }
        >
          {this.props.status}
        </button>
      </div>
    )
  }
}

export default CommandBar

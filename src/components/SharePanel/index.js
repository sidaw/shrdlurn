import React, { Component } from "react"
import classnames from "classnames"
import { connect } from "react-redux"
import Actions from "actions/logger"

class SharePanel extends Component {
  constructor(props) {
    super(props)

    this.state = { collapsed: false }
  }

  share() {
    this.props.dispatch(Actions.share())
  }

  render() {
    return (
      <div className={classnames("SidePanel", {"collapsed": this.state.collapsed})}>
        <div className="SidePanel-header">
          <span className="SidePanel-header-name">Submit</span>
          <div onClick={() => this.setState({ collapsed: !this.state.collapsed })} className="SidePanel-header-arrow">
            {(() => {
              if (this.state.collapsed) return (<span>&larr;</span>)
              return (<span>&rarr;</span>)
            })()}
          </div>
        </div>
        <div className="SidePanel-content">
          <div>
            <p>Once you have built an interesting structure, please share it with the community!</p>
            <p>You can share as many structures as you want!</p>
          </div>
          <button
            onClick={() => this.share()}
            className="active full">
            Share Structure
          </button>
        </div>
      </div>
    )
  }
}

export default connect()(SharePanel)

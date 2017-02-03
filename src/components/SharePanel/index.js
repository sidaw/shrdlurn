import React, { Component } from "react"
import classnames from "classnames"
import { connect } from "react-redux"
import Actions from "actions/logger"
import WorldActions from "actions/world"

import "./styles.css"

class SharePanel extends Component {
  constructor(props) {
    super(props)

    this.state = { collapsed: false }
  }

  share() {
    this.props.dispatch(Actions.share())
  }

  clear() {
    this.props.dispatch(WorldActions.clear())
  }

  deleteStruct() {
    this.props.dispatch(Actions.deleteStruct(this.refs.deleteSelect.value))
  }

  render() {
    return (
      <div className={classnames("SidePanel", {"collapsed": this.state.collapsed})}>
        <div className="SidePanel-header">
          <span className="SidePanel-header-name">Share this Structure</span>
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
            <p>When sharing, you override whatever structure exists in the "<strong>{(s => s.length > 8 ? s.substr(0,8-1)+'...' : s)(this.props.sid)}</strong>" slot. You&nbsp;can see all the shared structures on the leaderboard.</p>
            <br />
            <p><strong>Your impact:</strong> {this.props.score}</p>
          </div>
          <div className="SharePanel-buttons">
            <button
              onClick={() => this.share()}
              className="active full"
              style={{borderRadius:"3px"}}>
              Share now to {(s => s.length > 8 ? s.substr(0,8-1)+'...' : s)(this.props.sid)}
            </button>
            {/* <div className="yourstructs">
              <select ref="deleteSelect" defaultValue="disabled">
                <option disabled value="disabled">Select</option>
                {this.props.user_structs.map((id) =>
                  <option key={id} value={id}>{id}</option>
                )}
              </select>
              <button onClick={() => this.deleteStruct()}>Delete Struct</button>
            </div> */}
            <button
              onClick={() => this.clear()}
              className="active full red"
              style={{borderRadius:"3px"}}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user_structs: state.logger.user_structs,
  sessionId: state.user.sessionId,
  sid: state.logger.sid
})

export default connect(mapStateToProps)(SharePanel)

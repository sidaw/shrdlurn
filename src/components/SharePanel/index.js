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
    const { signedIn } = this.props

    return (
      <div className={classnames("SidePanel", { "collapsed": this.state.collapsed })}>
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
            <p>Please share your structure after you finish </p>
            <div className="SharePanel-buttons">
              <button
                onClick={() => this.share()}
                className="active full"
                style={{ borderRadius: "3px" }}>
                Share {signedIn ?
                  <span>to {(s => s.length > 8 ? s.substr(0, 8 - 1) + '...' : s)(this.props.sid)}</span>
                  :
                  <span>Structure</span>
                }
              </button>
              {signedIn ?
                <div className="yourstructs">
                  <select ref="deleteSelect" defaultValue="disabled">
                    <option disabled value="disabled">Select</option>
                    {this.props.user_structs.map((id) =>
                      <option key={id} value={id}>{id}</option>
                    )}
                  </select>
                  <button className="button-red" onClick={() => this.deleteStruct()}>Delete Struct</button>
                </div>
                :
                <div className="yourstructs">
                  <button onClick={() => this.clear()}>Clear</button>
                </div>
              }
            </div>
            <p><strong>Your impact:</strong> {this.props.score}</p>
            {signedIn ?
              <p>You will override the struct with this name when sharing. You&nbsp;can see existing shared structures on the leaderboard.</p>
              :
              <p>You will override your previously shared structure with this new structure when you share it. You can <strong>sign in via Slack to share an unlimited number of structures.</strong> You can see all of them on the Leaderboard.</p>
            }
            {signedIn &&
              <div className="name">
                <strong>Name your struct:</strong>
                <input
                  className="SharePanel-structname"
                  type="text"
                  value={this.props.sid}
                  maxLength={32}
                  onChange={(e) => this.props.dispatch(Actions.changeStructureId(e.target.value))}
                />
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user_structs: state.logger.user_structs,
  sessionId: state.user.sessionId,
  sid: state.logger.sid,
  signedIn: state.user.signedIn
})

export default connect(mapStateToProps)(SharePanel)

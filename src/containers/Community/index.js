import React, { Component } from "react"
import { connect } from "react-redux"
import Actions from "actions/logger"
import SharedStructures from "components/SharedStructures"
import LiveUtterances from "components/LiveUtterances"

import "./styles.css"

class Community extends Component {
  componentDidMount() {
    this.props.dispatch(Actions.joinCommunity())
  }

  render() {
    return (
      <div className="Community">
        <div>
          <SharedStructures structs={this.props.structs} />
        </div>
        <div>
          <LiveUtterances utterances={this.props.utterances} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  structs: state.logger.structs,
  utterances: state.logger.utterances
})

export default connect(mapStateToProps)(Community)

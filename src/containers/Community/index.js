import React, { Component } from "react"
import { connect } from "react-redux"
import Actions from "actions/logger"
import SharedStructures from "components/SharedStructures"

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
          live utterances
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  structs: state.logger.structs
})

export default connect(mapStateToProps)(Community)

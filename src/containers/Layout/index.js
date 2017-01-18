import React, { Component } from 'react'
import { connect } from "react-redux"
import Actions from "actions/user"
import Logger from "actions/logger"
import Header from "components/Header"

import "normalize.css"
import "./styles.css"

class Layout extends Component {
  componentDidMount() {
    /* Set the appropriate sessionId (either turker id or generated) */
    this.props.dispatch(Actions.setSessionId())

    /* Open Logging Socket */
    this.props.dispatch(Logger.open())
  }

  render() {
    return (
      <div className="container">
        <Header query={this.props.location.query} />
        {this.props.children}
      </div>
    )
  }
}

export default connect()(Layout)

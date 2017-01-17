import React, { Component } from 'react'
import { connect } from "react-redux"
import Actions from "actions/logger"
import Header from "components/Header"

import "normalize.css"
import "./styles.css"

class Layout extends Component {
  componentDidMount() {
    this.props.dispatch(Actions.open())
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

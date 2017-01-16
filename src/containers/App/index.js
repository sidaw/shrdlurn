import React, { Component } from 'react';
import BlocksWorld from "containers/BlocksWorld";
import Actions from "actions/world"
import Logger from "actions/logger"
import { connect } from "react-redux"
import Mousetrap from "mousetrap"

import "./styles.css"

class App extends Component {
  componentDidMount() {
    Mousetrap.prototype.stopCallback = () => false;
    Mousetrap.bind("command+z", (e) => { e.preventDefault(); this.props.dispatch(Actions.undo()) })
    Mousetrap.bind("command+shift+z", (e) => { e.preventDefault(); this.props.dispatch(Actions.redo()) })

    this.props.dispatch(Logger.open())
  }

  componentWillUnmount() {
    Mousetrap.unbind("command+z")
    Mousetrap.unbind("command+shift+z")
  }

  render() {
    return (
      <div className="App">
        <BlocksWorld />
      </div>
    );
  }
}

export default connect()(App);

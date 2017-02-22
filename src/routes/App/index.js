import React, { Component } from 'react'
import BlocksWorld from "containers/BlocksWorld"
import Actions from "actions/world"
import LoggerActions from "actions/logger"
import UserActions from "actions/user"
import { connect } from "react-redux"
import Mousetrap from "mousetrap"

// /* For Debugging: react perf tools to measure performance */
// import Perf from 'react-addons-perf'
// window.Perf = Perf
// window.Perf.start()

import "./styles.css"

class App extends Component {
  componentDidMount() {
    /* Bind Ctrl+Z and Crtl+Shift+Z to Undo and Redo actions respectively */
    Mousetrap.prototype.stopCallback = () => false;
    Mousetrap.bind("command+z", (e) => { e.preventDefault(); this.props.dispatch(Actions.undo()) })
    Mousetrap.bind("command+shift+z", (e) => { e.preventDefault(); this.props.dispatch(Actions.redo()) })

    /* If there is a ?taskid=N as a URL parameter, set the task as 'target',
     * otherwise, set a current structure id for the currently working sturct */
    if (Object.keys(this.props.location.query).indexOf("taskid") !== -1) {
      this.props.dispatch(UserActions.setTask("target"))
    } else {
      this.props.dispatch(LoggerActions.setStructureId())
    }
  }

  componentWillUnmount() {
    /* Clean up the key undo+redo bindings */
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

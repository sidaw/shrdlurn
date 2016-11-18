import React, { Component } from 'react';
import BlocksWorld from "containers/BlocksWorld";
import Header from "components/Header";
import Actions from "actions/world"
import { connect } from "react-redux"
import Mousetrap from "mousetrap"

import "./styles.css"

class App extends Component {
  componentDidMount() {
    Mousetrap.prototype.stopCallback = () => false;
    Mousetrap.bind("command+z", (e) => { e.preventDefault(); this.props.dispatch(Actions.undo()) })
    Mousetrap.bind("command+shift+z", (e) => { e.preventDefault(); this.props.dispatch(Actions.redo()) })
  }

  componentWillUnmount() {
    Mousetrap.unbind("command+z")
    Mousetrap.unbind("command+shift+z")
  }


  render() {
    return (
      <div className="App">
        <Header />
        <BlocksWorld />
      </div>
    );
  }
}

export default connect()(App);

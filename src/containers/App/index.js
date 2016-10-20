import React, { Component } from 'react';
import BlocksWorld from "containers/BlocksWorld";
import Header from "components/Header";

import "./styles.css"

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <BlocksWorld />
      </div>
    );
  }
}

export default App;

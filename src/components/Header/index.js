import React from "react"
import Strings from "constants/strings"
import Mousetrap from "mousetrap"

import "./styles.css"

function openTutorial() {
  window.open(Strings.TUTORIAL_URL, '_blank');
}

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = { modal: "" }
  }

  componentDidMount() {
    Mousetrap.bind("escape", (e) => this.setState({ modal: "" }))
  }

  componentWillUnmount() {
    Mousetrap.unbind("escape")
  }

  renderModal() {
    switch (this.state.modal) {
      case "helpme":
        return (
          <div className="modal-container">
            <div className="modal">
              <div className="modal-header">
                Help
                <div className="modal-escape" onClick={() => { this.setState({ modal: "" }) }}>
                  &times;
                </div>
              </div>
              <div className="modal-body">
                <ul className="modal-body-list">
                  <li>
                    <strong>Directions:</strong>
                    <ul>
                      <li>top</li>
                      <li>bot</li>
                      <li>left</li>
                      <li>right</li>
                      <li>front</li>
                      <li>back</li>
                      <li>very right of ...</li>
                      <li>very left of ...</li>
                      <li>very [dir] of ...</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Colors:</strong>
                    <ul>
                      <li>red</li>
                      <li>orange</li>
                      <li>yellow</li>
                      <li>green</li>
                      <li>blue</li>
                      <li>white</li>
                      <li>black</li>
                      <li>pink</li>
                      <li>brown</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Operators:</strong> &gt;, &gt;=, =, &lt;, &lt;=, ==. +, -, has, of, not
                  </li>
                  <li>
                    <strong>Primitives:</strong>
                      <ul>
                        <li>add</li>
                        <li>remove</li>
                        <li>select</li>
                        <li>repeat</li>
                      </ul>
                  </li>
                  <li>
                    <strong>Simple examples:</strong>
                    <ul>
                      <li>add red top</li>
                      <li>select very left of orange</li>
                      <li>add yellow 3 times</li>
                      <li>select very right and very top of yellow; add blue top</li>
                      <li>remove very left of yellow</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      default:
        return false
    }
  }

  render() {
    return (
      <div className="Header">
        <div className="Header-logo">
          <span>SHRDLURN </span>
          <span className="Header-sublogo">A Stanford NLP Project</span>
        </div>
        <div className="Header-nav">
          <div onClick={() => this.setState({ modal: "helpme" })}>Help Me</div>
          <div id="restart_tutorial" onClick={() => openTutorial()}>View Tutorial Again</div>
        </div>
        {this.renderModal()}
      </div>
    )
  }
}

export default Header

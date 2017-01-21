import React from "react"
import Strings from "constants/strings"
import Mousetrap from "mousetrap"
import { Link } from "react-router"
import Actions from "actions/world"
import { connect } from "react-redux"

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

  clear() {
    this.props.dispatch(Actions.clear())
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
                      <li>[dir]: top, bot, left, right, front, back</li>
                      <li>very [dir] of ...</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Colors:</strong>
                    <ul>
                      <li>red, orange, yellow, green, blue</li>
                      <li>white, black, pink, brown</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Operators:</strong>
                    <ul>
                      <li>has, of, not, and, or</li>
                      <li>&gt;, &gt;=, =, &lt;, &lt;=, +, -</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Blocks:</strong> all, none, this, previous, origin
                  </li>

                  <li>
                    <strong>Simple actions:</strong>
                      <ul>
                        <li>select, add, remove, move</li>
                      </ul>
                  </li>

                  <li>
                    <strong>Control:</strong> repeat, ;, [ ], &#123; &#125;, if
                  </li>

                  <li>
                    <strong>Simple examples:</strong>
                    <ul>
                      <li>add red top</li>
                      <li>add yellow</li>
                      <li>repeat 3 [add yellow top]</li>
                      <li>select top</li>
                      <li>select has color red</li>
                      <li>move top, move bot</li>
                    </ul>
                  </li>

                  <li>
                    <strong>More examples:</strong>
                    <ul>
                      <li>repeat 3 add red top</li>
                      <li>select top of left of this </li>
                      <li>select this or top of left of this</li>
                      <li>select all and not this</li>
                      <li>repeat 3 [add red; select top]</li>
                    </ul>
                  </li>

                  <li>
                    <strong>Imprecise</strong>
                    <ul>
                      <li>move left 3 times</li>
                      <li>do 3 times add red top</li>
                      <li>select the red</li>
                      <li>red stick of height 3</li>
                      <li>pick left or right</li>
                      <li>build giant red elephant</li>
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
          <div onClick={() => this.clear()}>Clear</div>
          <Link to={{ pathname: "/", query: this.props.query }} activeClassName="active"><div>SHRDLURN</div></Link>
          <Link to={{ pathname: "/community", query: this.props.query }} activeClassName="active" target="_blank"><div>Community</div></Link>
          <a target="_blank" href="https://shrdlurn.slack.com/shared_invite/MTI5NTA2Nzg1OTcxLTE0ODQ4MTIzNjQtNTc5NjE0OGFhNA"><div>Chat</div></a>
          <div onClick={() => this.setState({ modal: "helpme" })}>Help Me</div>
          <div id="restart_tutorial" onClick={() => openTutorial()}>View Tutorial Again</div>
        </div>
        {this.renderModal()}
      </div>
    )
  }
}

export default connect()(Header)

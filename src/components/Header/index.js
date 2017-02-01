import React from "react"
import Strings from "constants/strings"
import Mousetrap from "mousetrap"
import { Link } from "react-router"

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
                      <li>+, -</li>
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
                    <strong>Control:</strong> repeat, ;, [ ], &#123; &#125;, if, while, foreach, isolate
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
                    <strong>Advanced:</strong>
                    <ul>
                      <li> &#123; select left or right; add red &#125; </li>
                      <li> isolate [repeat 3 [add red left]] </li>
                      <li> if has color red [remove all]</li>
                      <li> while has height 0 [select left; add yellow]</li>
                      <li> select has row [row of left] </li>
											<li> foreach [remove has row row of this]  </li>
											<li> add red;  &#123; select right; update color color of left &#125;  </li>
                    </ul>
                  </li>

									<li>
										<strong>Possible extensions</strong>
										<ul>
											<li>move left 3 times</li>
											<li>do 3 times add red top</li>
											<li>move left until red</li>
											<li>red cube size 3</li>
											<li>surround this cube</li>
											<li>build big shrdlurn</li>
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
          <span>SHRDLURNING </span>
          <span className="Header-sublogo">A Stanford NLP Project</span>
        </div>
        <div className="Header-nav">
          <Link to={{ pathname: "/", query: this.props.query }} activeClassName="active"><div>Build</div></Link>
          <Link to={{ pathname: "/community", query: this.props.query }} activeClassName="active" target="_blank"><div>Leaderboard</div></Link>
          <a target="_blank" href="https://shrdlurn.signup.team/"><div>Slack</div></a>
          <div onClick={() => this.setState({ modal: "helpme" })}>Help</div>
          <div id="restart_tutorial" onClick={() => openTutorial()}>Tutorial</div>
        </div>
        {this.renderModal()}
      </div>
    )
  }
}

export default Header

import React from "react"
import Strings from "constants/strings"

import "./styles.css"

function openTutorial() {
  window.open(Strings.TUTORIAL_URL, '_blank');
}

const Header = () => (
  <div className="Header">
    <div className="Header-logo">
      <span>SHRDLURN </span>
      <span className="Header-sublogo">A Stanford NLP Project</span>
    </div>
    <div className="Header-nav">
      <div className="hidden" id="restart_tutorial" onClick={() => openTutorial()}>View Tutorial Again</div>
    </div>
  </div>
)

export default Header

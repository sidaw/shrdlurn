import React from "react"

import "./styles.css"

const Header = () => (
  <div className="Header">
    <div className="Header-logo">
      <span>SHRDLURN </span>
      <span className="Header-sublogo">A Stanford NLP Project</span>
    </div>
    <div className="Header-nav">
      <div className="structures-toggle">Structures</div>
      <div className="help-toggle">Help Me</div>
      <div className="keyboard-toggle">Keyboard Shortcuts</div>
      <div className="hidden" id="restart_tutorial">Restart Tutorial</div>
    </div>
  </div>
)

export default Header

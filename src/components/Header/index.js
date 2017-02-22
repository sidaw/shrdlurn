import React, { PropTypes } from "react"
import { TUTORIAL_URL, SLACK_SIGNUP_URL } from "constants/strings"
import { Link } from "react-router"

import "./styles.css"

const Header = ({ query }) => (
  <div className="Header">
    <div className="Header-logo">
      <span>Voxelurn</span>&nbsp;
      <span className="Header-sublogo">a Stanford NLP project</span>
    </div>
    <div className="Header-nav">
      <Link to={{ pathname: "/", query: query }} activeClassName="active"><div>Build</div></Link>
      <Link to={{ pathname: "/community", query: query }} activeClassName="active" target="_blank"><div>Leaderboard</div></Link>
      <a target="_blank" href={SLACK_SIGNUP_URL}><div>Slack</div></a>
      <Link to={{ pathname: "/help", query: query }} activeClassName="active"><div>Help</div></Link>
      <a target="_blank" href={TUTORIAL_URL}><div>Tutorial</div></a>
    </div>
  </div>
)

Header.propTypes = {
  /* URL parameters in order to persist the query (e.g ?turkid=AMT_123) across
   * route changes */
  query: PropTypes.object
}

export default Header

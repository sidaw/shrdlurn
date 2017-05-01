import React, { PropTypes } from "react"
import { Router, Route, IndexRedirect } from "react-router"
import Layout from './Layout'
import Build from './Build';
import Community from "./Community"
import Help from "./Help"
import About from "./About"
import Login from "./Login"
import Definitions from "./Definitions"

const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={Layout}>
      <IndexRedirect to="about" />

      <Route path="build" component={Build} />
      <Route path="community" component={Community} />
      <Route path="help" component={Help} />
      <Route path="about" component={About} />
      <Route path="login" component={Login} />
      <Route path="definitions" component={Definitions} />
    </Route>
  </Router>
)

Routes.propTypes = {
  /* History object for the router to interact with (e.g. hashHistory) */
  history: PropTypes.object
}

export default Routes
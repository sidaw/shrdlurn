import React, { PropTypes } from "react"
import { Router, Route } from "react-router"
import Layout from './Layout'
import App from './App';
import Community from "./Community"

const Routes = ({ history }) => (
  <Router history={history}>
    <Route component={Layout}>
      <Route path="/" component={App} />

      <Route path="community" component={Community} />
    </Route>
  </Router>
)

Routes.propTypes = {
  /* History object for the router to interact with (e.g. hashHistory) */
  history: PropTypes.object
}

export default Routes
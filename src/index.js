import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from "react-router"
import createStore from 'reducers/createStore';
import Layout from 'containers/Layout'
import App from 'containers/App';
import Community from "containers/Community"

const store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route component={Layout}>
        <Route path="/" component={App} />

        <Route path="community" component={Community} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)

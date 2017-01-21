import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from "react-router"
import createStore from 'reducers/createStore';
import { syncHistoryWithStore } from 'react-router-redux'
import Layout from 'containers/Layout'
import App from 'containers/App';
import Community from "containers/Community"

const store = createStore()

export function getStore() {
  return store
}

const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route component={Layout}>
        <Route path="/" component={App} />

        <Route path="community" component={Community} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)

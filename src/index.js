import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createStore from 'store/createStore'
import { syncHistoryWithStore } from 'react-router-redux'
import { hashHistory } from 'react-router'
import Routes from 'routes'

/* Create the Redux Store */
const store = createStore()

export const getStore = () => {
  return store
}

/* Create the history using hash (#routeName) method since we host this on
 * Github pages and it doesn't support browserHistory */
const history = syncHistoryWithStore(hashHistory, store)

/* Render our React App with Provider onto the root element */
ReactDOM.render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('root')
)

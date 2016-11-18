import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from 'reducers/createStore';
import Layout from 'containers/Layout'
import App from 'containers/App';

const store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <Layout>
      <App />
    </Layout>
  </Provider>,
  document.getElementById('root')
)

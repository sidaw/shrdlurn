import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import {persistStore, autoRehydrate} from 'redux-persist'
import makeRootReducer from '.'

export default (initialState = {}) => {
  const middleware = [thunk]

  const enhancers = [autoRehydrate()]

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )

  persistStore(store, {blacklist: ['user', 'logger', 'routing']})

  return store
}

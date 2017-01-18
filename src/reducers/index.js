import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import world from './world'
import user from './user'
import logger from './logger'

const makeRootReducer = () => {
  return combineReducers({
    routing: routerReducer,
    world,
    user,
    logger
  })
}

export default makeRootReducer

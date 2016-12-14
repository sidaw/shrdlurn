import { combineReducers } from 'redux'
import world from './world'
import user from './user'
import logger from './logger'

const makeRootReducer = () => {
  return combineReducers({
    world,
    user,
    logger
  })
}

export default makeRootReducer

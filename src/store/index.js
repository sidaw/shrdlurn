import { combineReducers } from 'redux'
import { routerReducer } from "react-router-redux"
import world from './world'
import user from './user'
import logger from './logger'

/* Combine all of our app's reducers */
const makeRootReducer = () => {
  return combineReducers({
    routing: routerReducer, // routes
    world, // relating to the setting and user interaction
    user, // relating to the user account
    logger // relating to the community server
  })
}

export default makeRootReducer

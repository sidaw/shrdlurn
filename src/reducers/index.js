import { combineReducers } from 'redux'
import world from './world'
import user from './user'

const makeRootReducer = () => {
  return combineReducers({
    world,
    user
  })
}

export default makeRootReducer

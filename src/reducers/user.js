import Constants from "constants/actions"
import Strings from "constants/strings"
import { getTurkId } from "helpers/turk"

const initialState = {
  sessionId: getTurkId()? getTurkId() : Strings.DEFAULT_SESSIONID
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SET_SESSION_ID:
      return { ...state, sessionId: action.sessionId }
    default:
      return state
  }
}

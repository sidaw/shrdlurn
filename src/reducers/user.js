import Constants from "constants/actions"

const initialState = {
  sessionId: "deadbeef"
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SET_SESSION_ID:
      return { ...state, sessionId: action.sessionId }
    default:
      return state
  }
}

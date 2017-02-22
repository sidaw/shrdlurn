import Constants from "constants/actions"

const initialState = {
  sessionId: "deadbeef",
  task: "world"
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SET_SESSION_ID:
      return { ...state, sessionId: action.sessionId }
    case Constants.SET_TASK:
      return { ...state, task: action.task }
    default:
      return state
  }
}

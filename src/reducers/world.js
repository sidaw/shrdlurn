import Constants from "constants/actions"

const initialState = {
  history: [{text: "initial", value: [{ x: 0, y: 0, z: 0, color: "Red", names: ["S"] }]}],
  responses: [],
  current_history_idx: -1,
  status: "try"
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.TRY_QUERY:
      let history = state.history
      if (state.current_history_idx >= 0) {
        history = history.slice(0, state.current_history_idx + 1)
      }
      return { ...state, responses: action.responses, history: history, current_history_idx: -1, status: "accept" }
    case Constants.ACCEPT:
      const newHistory = [...state.history, action.el]
      return { ...state, history: newHistory, responses: [], status: "try" }
    case Constants.REVERT:
      return { ...state, current_history_idx: action.idx, responses: [], status: "accept" }
    case Constants.SET_STATUS:
      return { ...state, status: action.status }
    default:
      return state
  }
}

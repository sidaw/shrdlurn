import Constants from "constants/actions"

const initialState = {
  history: [{text: "initial", value: [{ x: 0, y: 0, z: 0, color: "Fake", names: ["S"] }], formula: "(initial)"}],
  responses: [],
  current_history_idx: -1,
  status: "try",
  query: "",
  defining: false
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
      return { ...state, history: newHistory, responses: [], status: "try", query: "" }
    case Constants.DEFINE:
      const collapsedHistory = [...state.history.slice(0, action.idx - 1), {text: action.text, value: state.history[state.history.length - 1].value, formula: action.formula}]
      return { ...state, history: collapsedHistory, defining: false }
    case Constants.REVERT:
      return { ...state, current_history_idx: action.idx, responses: [], status: "try", query: "" }
    case Constants.SET_STATUS:
      return { ...state, status: action.status }
    case Constants.SET_QUERY:
      return { ...state, query: action.query }
    case Constants.RESET_RESPONSES:
      return { ...state, status: "try", query: "", responses: []}
    case Constants.OPEN_DEFINE:
      return { ...state, defining: true }
    case Constants.CLOSE_DEFINE:
      return { ...state, defining: false }
    default:
      return state
  }
}

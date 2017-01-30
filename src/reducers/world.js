import Constants from "constants/actions"

const initialState = {
  history: [{text: "initial", value: [{ x: 0, y: 0, z: 0, color: "Fake", names: ["S"] }], formula: "(initial)"}],
  responses: [],
  current_history_idx: -1,
  status: "try",
  query: "",
  defining: false,
  exampleQuery: "add red 3 times",
  defineN: null
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
      let collapsedHistory = [...state.history.slice(0, action.idx), {text: action.text, value: state.history[state.history.length - 1].value, formula: action.formula}]
      if (collapsedHistory.length === 0) collapsedHistory = initialState.history
      else if (collapsedHistory.length === 1) collapsedHistory = [...initialState.history, ...collapsedHistory]
      return { ...state, history: collapsedHistory, defining: false, defineN: null, query: "", status: "try" }
    case Constants.REVERT:
      if (state.defining) return state
      return { ...state, current_history_idx: action.idx, responses: [], status: "try", query: "" }
    case Constants.SET_STATUS:
      return { ...state, status: action.status }
    case Constants.SET_QUERY:
      return { ...state, query: action.query }
    case Constants.RESET_RESPONSES:
      return { ...state, status: "try", query: "", responses: []}
    case Constants.OPEN_DEFINE:
      return { ...state, defining: true, defineN: action.defineN }
    case Constants.CLOSE_DEFINE:
      const cleanHistory = state.history.filter(h => h.formula !== "false") /* we have to clean up any inejcted pins */
      return { ...state, defining: false, defineN: null, query: "", status: "try", history: cleanHistory }
    case Constants.SET_DEFINE_N:
      return { ...state, defineN: action.defineN }
    case Constants.SET_PIN:
      let newHistoryWithPin = [...state.history, {text: state.query, type: "pin", value: state.history[state.history.length - 1].value, formula: "()"}]
      return { ...state, history: newHistoryWithPin, query: initialState.query, responses: initialState.responses, status: initialState.status, defining: initialState.defining, defineN: initialState.defineN }
    case Constants.REMOVE_PIN:
      let newHistoryWithoutPin = state.history.slice()
      newHistoryWithoutPin.splice(action.idx, 1)
      return { ...state, history: newHistoryWithoutPin, current_history_idx: initialState.current_history_idx }
    case Constants.MARK_PIN:
      const markedHistory = state.history.slice()
      const index = action.idx ? action.idx : markedHistory.length - 1
      markedHistory[index] = { ...markedHistory[index], type: "pin" }
      return { ...state, history: markedHistory }
    case Constants.INJECT_PIN:
      let injectedHistory = state.history.slice(0)
      injectedHistory.splice(action.idx, 0, {text: "", type: "pin", value: [], formula: "false"})
      return { ...state, history: injectedHistory }
    case Constants.REMOVE_LAST:
      let trimmedHistory = state.history.slice(0, state.history.length - 1)
      return { ...state, history: trimmedHistory }
    case Constants.LOAD_STRUCT:
      const loadedHistory = action.history === null || action.history === "" || !(Array.isArray(action.history)) ? initialState.history : action.history
      return { ...initialState, history: loadedHistory }
    case Constants.CLEAR:
      return initialState
    default:
      return state
  }
}

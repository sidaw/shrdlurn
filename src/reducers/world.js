import Constants from "constants/actions"

const initialState = {
  history: [],
  responses: []
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.TRY_QUERY:
      return { ...state, responses: action.responses }
    case Constants.ACCEPT:
      const newHistory = [...state.history, action.el]
      return { ...state, history: newHistory }
    default:
      return state
  }
}

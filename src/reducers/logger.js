import Constants from "constants/actions"

const initialState = {
  socket: null,
  structs: [],
  lastRecipe: [],
  utterances: []
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.OPEN_LOGGING_SOCKET:
      return { ...state, socket: action.socket }
    case Constants.LOAD_COMMUNITY_STRUCTS:
      const structs = action.structs.map(s => {
        try {
          return { ...s, blocks: JSON.parse(s.blocks) }
        } catch (e) {
          return false
        }
      })
      return { ...state, structs: structs }
    case Constants.SHARED_STRUCT:
      return { ...state, lastRecipe: action.recipe }
    case Constants.NEW_UPVOTE:
      const modifiedStructs = state.structs.slice()
      const idx = modifiedStructs.findIndex(m => m.id === action.id)
      modifiedStructs[idx].up = action.up
      return { ...state, structs: modifiedStructs }
    case Constants.LOAD_COMMUNITY_UTTERANCES:
      return { ...state, utterances: action.utterances }
    default:
      return state
  }
}

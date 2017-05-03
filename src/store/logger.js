import Constants from "constants/actions"

const initialState = {
  socket: null,
  structs: "loading",
  lastValue: "",
  utterances: {},
  topBuilders: [],
  score: 0,
  user_structs: [],
  sid: "1",
  definitions: {}
}

/* Prune the number of utts displayed to under 10, ordered by latest timestamp */
function pruneUtts(utts) {
  if (Object.keys(utts).length < 10) return utts

  const slicedKeys = Object.keys(utts).sort((a, b) => {
    const aTime = parseInt(utts[a][0].timestamp, 10)
    const bTime = parseInt(utts[b][0].timestamp, 10)
    if (aTime < bTime) {
      return 1
    } else if (bTime < aTime) {
      return -1
    } else {
      return 0
    }
  }).slice(0, 7)

  const newUtts = {}
  for (const key of slicedKeys)
    newUtts[key] = utts[key]

  return newUtts
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.OPEN_LOGGING_SOCKET:
      return { ...state, socket: action.socket }
    case Constants.SHARED_STRUCT:
      return { ...state, lastValue: action.value }
    case Constants.NEW_ACCEPT:
      const prevUtterancesNA = state.utterances.hasOwnProperty(action.uid) ? state.utterances[action.uid] : []
      const newUttsNA = { ...state.utterances, [action.uid]: [{ type: "accept", msg: { query: action.query }, timestamp: action.timestamp }, ...prevUtterancesNA] }
      return { ...state, utterances: pruneUtts(newUttsNA) }
    case Constants.NEW_DEFINE:
      const prevUtterancesND = state.utterances.hasOwnProperty(action.uid) ? state.utterances[action.uid] : []
      const newUttsND = { ...state.utterances, [action.uid]: [{ type: "define", msg: { defineAs: action.defined }, timestamp: action.timestamp }, ...prevUtterancesND] }
      return { ...state, utterances: pruneUtts(newUttsND) }
    case Constants.NEW_UPVOTE:
      const modifiedStructs = state.structs.slice()
      const idx = modifiedStructs.findIndex(m => m.id === action.id && m.uid === action.uid)
      modifiedStructs[idx].upvotes.push(action.up)
      modifiedStructs[idx].score = action.score
      return { ...state, structs: modifiedStructs }
    case Constants.NEW_STRUCT:
      const value = JSON.parse(action.struct.value)
      const recipe = action.struct.recipe
      const newStruct = { uid: action.uid, id: action.id, score: action.score, upvotes: action.upvotes, image: action.image, value: value, recipe: recipe }

      if (state.structs === "loading") {
        return { ...state, structs: [newStruct] }
      }

      const sid_idx = state.structs.findIndex(s => s.uid === action.uid && s.id === action.id)
      if (sid_idx !== -1) {
        /* Modifying a preexisting struct */
        const newStructStructs = state.structs.slice()
        newStructStructs[sid_idx] = newStruct
        return { ...state, structs: newStructStructs }
      }

      return { ...state, structs: [...state.structs, newStruct] }
    case Constants.STRUCTS:
      return { ...state, structs: action.structs.map(s => ({ ...s, value: JSON.parse(s.struct.value), recipe: s.struct.recipe })) }
    case Constants.NEW_UTTERANCES:
      return { ...state, utterances: { ...state.utterances, [action.uid]: action.utterances.map(u => JSON.parse(u)) } }
    case Constants.LOAD_TOP_BUILDERS:
      return { ...state, topBuilders: action.topBuilders }
    case Constants.USER_SCORE:
      return { ...state, score: action.score }
    case Constants.USER_STRUCTS_COUNT:
      return { ...state, user_structs: action.structs }
    case Constants.SET_STRUCTURE_ID:
      return { ...state, sid: action.sid }
    case Constants.LOAD_DEFINITIONS:
      return { ...state, definitions: action.definitions }
    default:
      return state
  }
}

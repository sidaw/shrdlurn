import Constants from "constants/actions"
import { formatQuery, SEMPREquery, parseSEMPRE } from "helpers/sempre"

function sendContext(history, current_history_idx, sessionId) {
  let contextCommand = "(context)"

  if (history.length > 0) {
    const idx = current_history_idx >= 0 ? current_history_idx : history.length - 1
    const currentState = history[idx].value
    const prevState = JSON.stringify(JSON.stringify(currentState.map(c => ([c.x, c.y, c.z, c.color, c.names]))))
    contextCommand = `(context (graph NaiveKnowledgeGraph ((string ${prevState}) (name b) (name c))))`
  }

  const contextCmds = { q: contextCommand, sessionId: sessionId }

  return SEMPREquery(contextCmds)
}

const Actions = {
  tryQuery: (q) => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user
      const { history, current_history_idx } = getState().world

      return sendContext(history, current_history_idx, sessionId)
        .then((eh) => {
          const query = formatQuery(q)
          const cmds = { q: query, sessionId: sessionId }

          return SEMPREquery(cmds)
            .then((response) => {
              const formval = parseSEMPRE(response.candidates)

              if (formval === null || formval === undefined) {
                return false
              } else {
                dispatch({
                  type: Constants.TRY_QUERY,
                  responses: formval
                })
                return true
              }
            })
        })
        .catch((e) => {
          console.log("tryQuery error?", e)
          return false
        })
    }
  },

  pushToHistory: (el) => {
    return (dispatch) => {
      dispatch({
        type: Constants.ACCEPT,
        el: el
      })
    }
  },

  accept: (text, selectedResp) => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user
      const { responses } = getState().world

      const selected = responses[selectedResp]

      SEMPREquery({ q: text, accept: selected.rank, sessionId: sessionId }, () => {});

      dispatch({
        type: Constants.ACCEPT,
        el: {...selected, text}
      })

      return true
    }
  },

  define: (defineAs, defineIdx) => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user
      const { history } = getState().world

      const defineHist = history.slice(defineIdx - 1, history.length).map(h => [h.text, h.formula])

      /* TODO: define things that have definitions within them? -- what to do about logical form? */

      const query = `(uttdef "${defineAs}" ${JSON.stringify(defineHist)})`

      SEMPREquery({ q: query, sessionId: sessionId })

      dispatch({
        type: Constants.DEFINE,
        text: defineAs,
        idx: defineIdx
      })
    }
  },

  revert: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.REVERT,
        idx: idx
      })
    }
  },

  undo: () => {
    return (dispatch, getState) => {
      const { current_history_idx, history } = getState().world

      const idx = current_history_idx !== 0 ? (current_history_idx >= 0 ? current_history_idx - 1 : history.length - 2) : current_history_idx

      dispatch({
        type: Constants.REVERT,
        idx: idx
      })
    }
  },

  redo: () => {
    return (dispatch, getState) => {
      const { current_history_idx, history } = getState().world

      const idx = current_history_idx !== history.length - 1 ? (current_history_idx >= 0 ? current_history_idx + 1 : -1) : current_history_idx

      dispatch({
        type: Constants.REVERT,
        idx: idx
      })
    }
  },

  setStatus: (status) => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_STATUS,
        status
      })
    }
  },

  setQuery: (query) => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_QUERY,
        query
      })
    }
  }
}

export default Actions

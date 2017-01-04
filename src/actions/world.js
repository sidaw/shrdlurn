import Constants from "constants/actions"
import { SEMPREquery, parseSEMPRE } from "helpers/sempre"
import Logger from "actions/logger"
import { blocksEqual } from "helpers/blocks"

function sendContext(history, current_history_idx, sessionId) {
  let contextCommand = "(:context)"

  if (history.length > 0) {
    const idx = current_history_idx >= 0 && current_history_idx < history.length ? current_history_idx : history.length - 1
    const currentState = history[idx].value
    const prevState = JSON.stringify(JSON.stringify(currentState.map(c => ([c.x, c.y, c.z, c.color, c.names]))))
    contextCommand = `(:context ${prevState})`
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
          const query = q
          const cmds = { q: query, sessionId: sessionId }

          return SEMPREquery(cmds)
            .then((response) => {
              const formval = parseSEMPRE(response.candidates)

              if (formval === null || formval === undefined) {
                dispatch(Logger.log({ type: "tryFail", msg: { query: q }}))
                return false
              } else {
                /* Remove no-ops */
                const idx = current_history_idx >= 0 && current_history_idx < history.length ? current_history_idx : history.length - 1
                const currentValue = history[idx].value
                const responses = formval.filter((a) => {
                  return !blocksEqual(a.value, currentValue)
                })

                dispatch(Logger.log({ type: "try", msg: { query: q, responses: formval.length } }))
                dispatch({
                  type: Constants.TRY_QUERY,
                  responses: responses
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

      SEMPREquery({ q: text, accept: selected.rank, sessionId: sessionId }, () => {})

      dispatch(Logger.log({ type: "accept", msg: { query: text, rank: selected.rank, formula: selected.formula } }))

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

      const defineHist = history.slice(defineIdx + 1, history.length).map(h => [h.text, h.formula]).filter(h => h.type !== "pin")

      // scope multiline definitions by default
      const mode = defineHist.length > 1? ':def' : ':def_ret'
      const query = `(${mode} "${defineAs}" ${JSON.stringify(JSON.stringify(defineHist))})`

      /* Submit the define command */
      SEMPREquery({ q: query, sessionId: sessionId })
        .then((r) => {
          /* Then, we need to get the associated formula for this definition to
           * properly populate the history in order to in the future define
           * things with definitions in them. */
          sendContext(history.slice(0, defineIdx), -1, sessionId)
            .then((eh) => {
              const query = defineAs
              SEMPREquery({ q: query, sessionId: sessionId})
                .then((response) => {
                  const formval = parseSEMPRE(response.candidates)
                  const topFormula = formval[0].formula

                  dispatch(Logger.log({ type: "define", msg: { defineAs: defineAs, idx: defineIdx, length: defineHist.length, formula: topFormula } }))

                  dispatch({
                    type: Constants.DEFINE,
                    text: defineAs,
                    idx: defineIdx,
                    formula: topFormula
                  })
                })
            })
        })
    }
  },

  revert: (idx) => {
    return (dispatch) => {
      dispatch(Logger.log({ type: "revert", msg: { idx: idx }}))

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
  },

  resetResponses: () => {
    return (dispatch) => {
      dispatch({
        type: Constants.RESET_RESPONSES
      })
    }
  },

  closeDefine: () => {
    return (dispatch) => {
      dispatch({
        type: Constants.CLOSE_DEFINE
      })
    }
  },

  openDefine: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.OPEN_DEFINE,
        defineN: idx
      })
    }
  },

  setDefineN: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_DEFINE_N,
        defineN: idx
      })
    }
  },

  refreshExample: () => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user

      const query = `(:autocomplete "")`

      SEMPREquery({ q: query, sessionId: sessionId })
        .then((r) => {
          dispatch({
            type: Constants.REFRESH_EXAMPLE,
            query: r.autocompletes[0]
          })
        })
    }
  },

  setPin: () => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_PIN
      })
    }
  },

  markPin: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.MARK_PIN,
        idx
      })
    }
  },

  injectPin: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.INJECT_PIN,
        idx
      })
    }
  },

  removePin: (idx) => {
    return (dispatch) => {
      dispatch({
        type: Constants.REMOVE_PIN,
        idx
      })
    }
  },

  removeLast: () => {
    return (dispatch) => {
      dispatch({
        type: Constants.REMOVE_LAST
      })
    }
  }
}

export default Actions

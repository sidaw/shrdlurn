import Constants from "constants/actions"
import { formatQuery, SEMPREquery, parseSEMPRE } from "helpers/sempre"

function sendContext(history, sessionId) {
  let contextCommand = "(context)"

  if (history.length > 0) {
    console.log("SENDING CONTEXT")
    const currentState = history[history.length - 1].value
    const prevState = JSON.stringify(JSON.stringify(currentState.map(c => ([c.x, c.y, c.z, c.color, c.names]))))
    console.log(prevState)
    contextCommand = `(context (graph NaiveKnowledgeGraph ((string ${prevState}) (name b) (name c))))`
  }

  const contextCmds = { q: contextCommand, sessionId: sessionId }

  return SEMPREquery(contextCmds)
}

const Actions = {
  tryQuery: (q) => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user
      const { history } = getState().world

      return sendContext(history, sessionId)
        .then((eh) => {
          console.log(eh)
          const query = formatQuery(q)
          const cmds = { q: query, sessionId: sessionId }

          SEMPREquery(cmds)
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

  accept: (query, selectedResp) => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user
      const { responses } = getState().world

      const selected = responses[selectedResp]

      SEMPREquery({ q: query, accept: selected.rank, sessionId: sessionId }, () => {});

      dispatch({
        type: Constants.ACCEPT,
        el: selected
      })
    }
  }
}

export default Actions

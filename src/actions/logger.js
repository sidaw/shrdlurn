import Constants from "constants/actions"

function sendSocket(getState, event, payload) {
  const { sessionId } = getState().user
  let socket = getState().logger.socket

  const message = { ...payload, sessionId: sessionId.replace(/&/g, "amp;"), timestamp: Date.now() }

  if (socket) {
    socket.emit("log", payload)
  } else {
    setTimeout(() => {
      socket = getState().logger.socket
      if (socket) {
        socket.emit(event, message)
      } else {
        console.log("send socket failed retry, error?")
      }
    }, 2000)
  }
}

const Actions = {
  open: () => {
    return (dispatch) => {
      dispatch({
        type: Constants.OPEN_LOGGING_SOCKET
      })
    }
  },

  log: (e) => {
    return (dispatch, getState) => {
      const payload = { type: e.type, message: e.msg }

      sendSocket(getState, "log", payload)
    }
  },

  share: () => {
    return (dispatch, getState) => {
      const { history } = getState().history

      const structure = history[history.length - 1]
      const value = JSON.stringify(structure.value)
      const recipe = history.map(h => h.text)

      const payload = { structure: value, recipe: recipe }

      sendSocket(getState, "share", payload)
    }
  }
}

export default Actions

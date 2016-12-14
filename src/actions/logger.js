import Constants from "constants/actions"

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
      const { sessionId } = getState().user
      let { socket } = getState().logger

      const payload = { sessionId: sessionId.replace(/&/g, "amp;"), timestamp: Date.now(), type: e.type, message: e.msg }

      if (socket) {
        socket.emit("log", payload)
      } else {
        setTimeout(() => {
          socket = getState().logger.socket
          if (socket) {
            socket.emit("log", payload)
          } else {
            console.log("log failed retry, error?")
          }
        }, 2000)
      }
    }
  }
}

export default Actions

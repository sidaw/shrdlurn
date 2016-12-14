import io from "socket.io-client"
import Constants from "constants/actions"
import Strings from "constants/strings"

const initialState = {
  socket: null
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.OPEN_LOGGING_SOCKET:
      const socket = io(Strings.LOGGER_URL)
      socket.on("connect", () => {
        console.log("logging socket connected")
      })
      return { ...state, socket: socket }
    default:
      return state
  }
}

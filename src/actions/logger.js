import io from "socket.io-client"
import Constants from "constants/actions"
import Strings from "constants/strings"

function sendSocket(getState, event, payload) {
  const { sessionId } = getState().user
  let socket = getState().logger.socket

  const message = { ...payload, sessionId: sessionId.replace(/&/g, "amp;"), timestamp: Date.now() }

  return new Promise((resolve, reject) => {
    if (socket) {
      socket.emit(event, message)
      resolve(socket)
    } else {
      // Retry
      setTimeout(() => {
        socket = getState().logger.socket
        if (socket) {
          socket.emit(event, message)
          resolve(socket)
        } else {
          setTimeout(() => {
            socket = getState().logger.socket
            if (socket) {
              socket.emit(event, message)
              resolve(socket)
            } else {
              setTimeout(() => {
                socket = getState().logger.socket
                if (socket) {
                  socket.emit(event, message)
                  resolve(socket)
                } else {
                  console.log("send socket failed retry, error?")
                  reject("retry failed")
                }
              }, 3000)
            }
          }, 1000)
        }
      }, 500)
    }
  })
}

const Actions = {
  open: () => {
    return (dispatch) => {
      const socket = io(Strings.LOGGER_URL)
      socket.on("connect", () => {
        console.log("logging socket connected")

        dispatch({
          type: Constants.OPEN_LOGGING_SOCKET,
          socket: socket
        })
      })
    }
  },

  log: (e) => {
    return (dispatch, getState) => {
      const payload = { type: e.type, message: e.msg }

      sendSocket(getState, "log", payload)
    }
  },

  joinCommunity: (e) => {
    return (dispatch, getState) => {
      sendSocket(getState, "join", {"room": "community"})
        .then((socket) => {
          console.log("joined the community room")

          socket.on("structs", (e) => {
            dispatch({
              type: Constants.LOAD_COMMUNITY_STRUCTS,
              structs: e.structs
            })
          })

          socket.on("newupvote", (m) => {
            dispatch({
              type: Constants.NEW_UPVOTE,
              idx: m.idx,
              id: m.id,
              up: m.up
            })
          })

          socket.on("utterances", (e) => {
            dispatch({
              type: Constants.LOAD_COMMUNITY_UTTERANCES,
              utterances: e.utterances
            })
          })
        })
    }
  },

  share: () => {
    return (dispatch, getState) => {
      const { history } = getState().world
      const { lastRecipe } = getState().logger

      const structure = history[history.length - 1]

      if (structure.value.length < 10) {
        alert("You are sharing a really simple structure (less than 10 blocks total). Try creating something a bit more complex and interesting and then sharing that.")
        return
      }

      const value = JSON.stringify(structure.value)
      const recipe = history.map(h => h.text)

      if (recipe.length === lastRecipe.length && recipe.every((v,i)=> v === lastRecipe[i])) {
        alert("You've already shared this structure.")
        return
      }

      const payload = { blocks: value, recipe: recipe }

      sendSocket(getState, "share", payload)

      alert("Shared your structure! View it on the Community page.")

      dispatch({
        type: Constants.SHARED_STRUCT,
        recipe: recipe
      })
    }
  },

  upvote: (id, idx) => {
    return (dispatch, getState) => {
      const payload = { id: id, idx: idx }
      sendSocket(getState, "upvote", payload)
    }
  }
}

export default Actions

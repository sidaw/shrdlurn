import io from "socket.io-client"
import Constants from "constants/actions"
import { COMMUNITY_SERVER_URL, CUBE_MINIMUM } from "constants/strings"
import { setStore, getStore, genSid, resizePNG } from "helpers/util"

function sendSocket(getState, event, payload) {
  let socket = getState().logger.socket
  let uid = getState().user.sessionId

  const token = getStore("auth_token", "")

  const message = { ...payload, uid: uid, token: token }

  return new Promise((resolve, reject) => {
    if (socket && socket.connected && typeof socket.emit === "function") {
      socket.emit(event, message)
      resolve(socket)
    } else {
      // Retry
      setTimeout(() => {
        socket = getState().logger.socket
        if (socket && socket.connected && typeof socket.emit === "function") {
          socket.emit(event, message)
          resolve(socket)
        } else {
          setTimeout(() => {
            socket = getState().logger.socket
            if (socket && socket.connected && typeof socket.emit === "function") {
              socket.emit(event, message)
              resolve(socket)
            } else {
              setTimeout(() => {
                socket = getState().logger.socket
                if (socket && socket.connected && typeof socket.emit === "function") {
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
    return (dispatch, getState) => {
      const { sessionId } = getState().user

      const socket = io(COMMUNITY_SERVER_URL)
      socket.on("connect", () => {
        console.log("logging socket connected")

        sendSocket(getState, "session", { "sessionId": sessionId })

        sendSocket(getState, "getscore", {})

        sendSocket(getState, "getstructcount", {})

        /* Query for a new score every 45 seconds */
        setInterval(() => sendSocket(getState, "getscore", {}), 45000)

        dispatch({
          type: Constants.OPEN_LOGGING_SOCKET,
          socket: socket
        })
      })

      socket.on("score", (e) => {
        dispatch({
          type: Constants.USER_SCORE,
          score: e.score
        })
      })

      socket.on("user_structs", (e) => {
        dispatch({
          type: Constants.USER_STRUCTS_COUNT,
          structs: e.structs.map(f => f.substring(0, f.length))
        })
      })

      socket.on("sign_in", (e) => {
        setStore("auth_token", e.token)

        dispatch({
          type: Constants.SIGN_IN,
          id: e.id,
          name: e.name,
          email: e.email,
          token: e.token
        })
      })

      socket.on("sign_in_failed", (e) => {
        setStore("auth_token", "")

        dispatch({
          type: Constants.CLEAR
        })
      })

      socket.on("definitions", (e) => {
        const definitions = {}
        for (const definition of e.definitions)
          definitions[definition.symbol] = definition

        dispatch({
          type: Constants.LOAD_DEFINITIONS,
          definitions
        })
      })
    }
  },

  setStructureId: (e) => {
    return (dispatch, getState) => {
      /* Set structure Id */
      const routing = getState().routing

      let structureId = ""
      const location = routing.location || routing.locationBeforeTransitions
      const sidParam = location.query.sid

      if (sidParam) {
        structureId = sidParam
      } else {
        let sid = getStore("sid")
        if (!sid) {
          sid = genSid()
          setStore("sid", sid)
        }
        structureId = sid
      }

      dispatch({
        type: Constants.SET_STRUCTURE_ID,
        sid: structureId
      })
    }
  },

  changeStructureId: (sid) => {
    return (dispatch) => {
      setStore("sid", sid)
      dispatch({
        type: Constants.SET_STRUCTURE_ID,
        sid: sid
      })
    }
  },

  log: (e) => {
    return (dispatch, getState) => {
      const payload = { type: e.type, msg: e.msg }

      sendSocket(getState, "log", payload)
    }
  },

  joinCommunity: (e) => {
    return (dispatch, getState) => {
      sendSocket(getState, "join", { "room": "community" })
        .then((socket) => {
          console.log("joined the community room")

          socket.on("new_accept", (e) => {
            dispatch({
              type: Constants.NEW_ACCEPT,
              uid: e.uid,
              query: e.query,
              timestamp: e.timestamp
            })
          })

          socket.on("new_define", (e) => {
            dispatch({
              type: Constants.NEW_DEFINE,
              uid: e.uid,
              defined: e.defined,
              timestamp: e.timestamp
            })
          })

          socket.on("upvote", (e) => {
            dispatch({
              type: Constants.NEW_UPVOTE,
              uid: e.uid,
              id: e.id,
              up: e.up,
              score: e.score
            })
          })

          socket.on("struct", (e) => {
            dispatch({
              type: Constants.NEW_STRUCT,
              uid: e.uid,
              id: e.id,
              image: e.image,
              score: e.score,
              upvotes: e.upvotes,
              struct: e.struct
            })
          })

          socket.on("structs", (e) => [
            dispatch({
              type: Constants.STRUCTS,
              structs: e
            })
          ])

          socket.on("utterances", (e) => {
            dispatch({
              type: Constants.NEW_UTTERANCES,
              uid: e.uid,
              utterances: e.utterances
            })
          })

          socket.on('top_builders', (e) => {
            dispatch({
              type: Constants.LOAD_TOP_BUILDERS,
              topBuilders: e.top_builders
            })
          })
        })
    }
  },

  share: () => {
    return (dispatch, getState) => {
      const { history } = getState().world
      const { lastValue, user_structs, sid } = getState().logger

      if (user_structs.length > 100) {
        alert("You have already shared 100 structures. If you want to share more, please delete some of them first.")
        return
      }

      const structure = history[history.length - 1]

      if (structure.value.length < CUBE_MINIMUM) {
        alert(`You are sharing a really simple structure (less than ${CUBE_MINIMUM} blocks total). Try creating something a bit more complex and interesting and then sharing that.`)
        return
      }

      const value = JSON.stringify(structure.value)
      const recipe = history.map(h => h.text)

      if (value === lastValue) {
        alert("You've already shared this structure. Make a new structure, and share that!")
        return
      }

      const canvas = document.getElementById("blocksCanvas")
      resizePNG(canvas.toDataURL("image/png"), 160, 120)
        .then(png => {
          const payload = { struct: { value, recipe }, image: png, id: sid }

          sendSocket(getState, "share", payload)

          alert("Shared your structure! View it on the Community page.")

          dispatch({
            type: Constants.SHARED_STRUCT,
            value: value
          })
        })
    }
  },

  upvote: (uid, id) => {
    return (dispatch, getState) => {
      const payload = { struct_uid: uid, id: id }
      sendSocket(getState, "upvote", payload)
    }
  },

  deleteStruct: (id) => {
    return (dispatch, getState) => {
      const payload = { id: id }
      sendSocket(getState, "delete_struct", payload)

      /* Reduce structs count by 1 */
      const { user_structs } = getState().logger
      dispatch({
        type: Constants.USER_STRUCTS_COUNT,
        structs: user_structs.filter(a => a !== id)
      })
    }
  },

  signIn: (code) => {
    return (dispatch, getState) => {
      sendSocket(getState, "sign_in", { code })
    }
  },

  getUser: () => {
    return (dispatch, getState) => {
      let { token } = getState().user

      if (!token) {
        /* Check localStorage because reduxPersist's rehydration is not
         * guaranteed to have finished when this function is called */
        const userStorage = getStore("reduxPersist:user")
        if (userStorage.token)
          token = userStorage.token
      }

      if (token)
        sendSocket(getState, "get_user", { token })
    }
  },

  getDefinitions: () => {
    return (dispatch, getState) => {
      sendSocket(getState, "get_definitions")
    }
  }
}

export default Actions

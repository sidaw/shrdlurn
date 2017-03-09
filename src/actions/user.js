import Constants from "constants/actions"
import { getStore, setStore, genUid } from "helpers/util"

const Actions = {
  setSessionId: () => {
    return (dispatch, getState) => {
      // const routing = getState().routing

      /* Session ID is either (in order of priority) the provided uid query
       * parameter in the URL, the UID stored in localStorage, or a newly
       * generated UID stored in localStorage. */
      let sessionId = ""

      // TODO: I disabled setting UID from URL parameter - it is either random,
      // and sticky, or via login.
      /* We get the UID param from the routing reducer */
      // const location = routing.location || routing.locationBeforeTransitions
      // const uidParam = location.query.uid

      // if (uidParam) {
      // sessionId = uidParam
      // } else {
      let uid = getStore("uid")
      if (!uid) {
        uid = genUid()
        setStore("uid", uid)
      }
      sessionId = uid
      // }

      dispatch({
        type: Constants.SET_SESSION_ID,
        sessionId: sessionId
      })
    }
  },

  setTask: (task) => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_TASK,
        task
      })
    }
  }
}

export default Actions

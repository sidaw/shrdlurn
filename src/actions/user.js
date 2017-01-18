import Constants from "constants/actions"
import { getStore, setStore, genUid } from "helpers/util"

const Actions = {
  setSessionId: () => {
    return (dispatch, getState) => {
      const routing = getState().routing

      /* Session ID is either (in order of priority) the provided uid query
       * parameter in the URL, the UID stored in localStorage, or a newly
       * generated UID stored in localStorage. */
      let sessionId = ""

      const location = routing.location || routing.locationBeforeTransitions
      const uidParam = location.query.uid
      if (uidParam) {
        sessionId = uidParam
      } else {
        let uid = getStore("uid")
        if (!uid) {
          uid = genUid()
          setStore("uid", uid)
        }
        sessionId = uid
      }
      console.log(sessionId)

      dispatch({
        type: Constants.SET_SESSION_ID,
        sessionId: sessionId
      })
    }
  }
}

export default Actions

import Constants from "constants/actions"

const Actions = {
  setSessionId: (sessionId) => {
    return (dispatch) => {
      dispatch({
        type: Constants.SET_SESSION_ID,
        sessionId: sessionId
      })
    }
  }
}

export default Actions

import React from "react"
import { STATUS, TRY_MSG, ACCEPT_MSG, DEFINE_MSG } from "constants/strings"

import "./styles.css"

const StatusMsg = ({ status }) => {
  let msg = TRY_MSG
  if (status === STATUS.ACCEPT) {
    msg = ACCEPT_MSG
  } else if (status === STATUS.DEFINE) {
    msg = DEFINE_MSG
  }

  return (
    <div className="StatusMsg">
      {msg}
    </div>
  )
}

export default StatusMsg
import React from "react"
import { getTurkCode } from "helpers/turk"

import "./styles.css"

const Win = ({ targetIdx, nSteps, nBlocks }) => (
  <div className="Win">
    <div>
      <div className="modal-header">Congratulations! You have won!</div>
      <div className="modal-body">
        <p>
          You have successfully completed the hit. Please copy and paste the code below in the MTurk form to complete the hit:
        </p>
        <code>
          {getTurkCode(targetIdx, nSteps, nBlocks)}
        </code>
      </div>
    </div>
  </div>
)

export default Win

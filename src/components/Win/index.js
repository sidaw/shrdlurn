import React from "react"
import { getTurkCode } from "helpers/turk"

import "./styles.css"

const Win = ({ targetIdx, nSteps, nBlocks, restart }) => (
  <div className="Win modal-container">
    <div className="modal">
      <div className="modal-header">Congratulations! You have won!</div>
      <div className="modal-body">
        <p>
          You have successfully completed the hit. Please copy and paste the code below in the MTurk form to complete the hit:
        </p>
        <code>
          {getTurkCode(targetIdx, nSteps, nBlocks)}
        </code>
        <br />
        <br />
        <br />
        <br />
        <button className="active" onClick={() => restart()}>Restart the Game</button>
      </div>
    </div>
  </div>
)

export default Win

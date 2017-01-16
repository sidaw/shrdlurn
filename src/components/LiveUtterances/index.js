import React from "react"

import "./styles.css"

const LiveUtterances = ({ utterances }) => {
  return (
    <div className="LiveUtterances">
      <div className="Community-header">
        <h3>Live Utterances</h3>
        <p>A stream of the latest utterances given to SHRDLURN by the most recent turkers.</p>
      </div>
      <div className="Community-content">
        {Object.keys(utterances).map(k => (
          <div key={k} className="LiveUtterances-group">
            <div className="LiveUtterances-groupid">{k}</div>
            {utterances[k].map((u, idx) => (
              <span key={idx} className="LiveUtterances-utterance">
                {JSON.parse(u)["message"]["query"]}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveUtterances

import React from "react"
import moment from "moment"

import "./styles.css"

const LiveUtterances = ({ utterances }) => {
  return (
    <div className="LiveUtterances">
      <div className="Community-header">
        <h3>Newest Builders</h3>
        <p>A stream of the latest commands given to SHRDLURN by the most recent users.</p>
      </div>
      <div className="Community-content">
        {Object.keys(utterances).map(k => {
          try {
            const utts = utterances[k]
             return (
              <div key={k} className="LiveUtterances-group">
                <div className="LiveUtterances-groupid">
                  <div><span className="title">user:</span> {k}</div>
                  <div className="time">{moment(utts[0].timestamp * 1000).calendar(null, {
                      sameDay: '[Today at] h:mm:ss a',
                      nextDay: '[Tomorrow at] h:mm:ss a',
                      nextWeek: '[Next] dddd',
                      lastDay: '[Yesterday at] h:mm:ss a',
                      lastWeek: '[Last] dddd',
                      sameElse: 'DD/MM/YYYY'
                    })}
                  </div>
                </div>
                {utts.map((u, idx) => {
                  try {
                    return (
                      <span key={idx} className="LiveUtterances-utterance">
                        {u.type === "accept" ?
                          u["msg"]["query"]
                        :
                          <span className="define">defined "{u["msg"]["defineAs"]}"</span>
                        }
                      </span>
                    )
                  } catch (e) {
                    return false
                  }
                })}
              </div>
            )
          } catch (e) {
            return false
          }
        })}
      </div>
    </div>
  )
}

export default LiveUtterances

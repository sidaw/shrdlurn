import React from "react"
import moment from "moment"

import "./styles.css"

const LiveUtterances = ({ utterances, topBuilders }) => {
  return (
    <div className="LiveUtterances">
      <div className="Community-header">
        <h3>Top Builders</h3>
        <p>Some of our best builders with some of the terms they have defined.</p>
      </div>
      <div className="Community-content">
        {topBuilders.sort((a, b) => {
          if (a[1] < b[1]) {
            return 1
          } else if (a[1] > b[1]) {
            return -1
          } else {
            return 0
          }
        }).map(b => (
          <div key={b[0]} className="LiveUtterances-group">
            <div className="LiveUtterances-groupid">
              <div>
                <span className="title">user:</span> {b[0].slice(0, 8)}&nbsp;&nbsp;|&nbsp;&nbsp;
                <span className="title">impact:</span> {b[1]}&nbsp;&nbsp;|&nbsp;&nbsp;
                <span className="title">score:</span> {b[2].reduce((acc, c) => acc + c["cite"] + c["self"], 0)}</div>
            </div>
            {b[2].map((u, idx) => {
              return (
                <span key={idx} className="LiveUtterances-utterance">
                  <span>{u.head}<br /><span style={{fontSize:"0.7em"}}>{u.cite + u.self} pts</span></span>
                  <div className="LiveUtterances-utterance-body">
                    {`score:${u.cite + u.self}, self:${u.self}, defined as "${u.body}"`}
                  </div>
                </span>
              )
            })}
          </div>
        ))}
      </div>
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
                  <div><span className="title">user:</span> {k.slice(0, 8)}</div>
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

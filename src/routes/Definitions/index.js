import React, { Component } from "react"
import { connect } from "react-redux"
import Actions from "actions/logger"

import "./styles.css"

class Definitions extends Component {
  componentDidMount() {
    this.props.dispatch(Actions.getDefinitions())
  }

  scrollTo(id) {
    const element = document.getElementById(id)
    element.scrollIntoView(true)
  }

  render() {
    if (Object.keys(this.props.definitions).length === 0)
      return (
        <div className="Definitions"><div className="Community-header"><h3>Definitions</h3></div>Loading...</div>
      )

    return (
      <div className="Definitions">
        <div className="Community-header">
          <h3>Definitions</h3>
        </div>
        {Object.keys(this.props.definitions).map(s => {
          const d = this.props.definitions[s]
          return (
            <div key={s} id={s} className="Definition">
              {d.head.join(" ")}
              <div style={{ fontSize: "0.7em" }}>
                {d.body.map((b, idx) => (
                  <span key={idx} className="Step">
                    {b.map((t, idx) => {
                      if (typeof t === "string") {
                        return (<span key={idx}>{t}{idx !== t.length - 1 && " "}</span>)
                      } else {
                        return (
                          <a key={idx} onClick={() => this.scrollTo(t[0])}>{t.slice(1).join(" ")}</a>
                        )
                      }
                    })}
                    {idx !== b.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  definitions: state.logger.definitions
})

export default connect(mapStateToProps)(Definitions)
import React, { Component, PropTypes } from "react"
import { connect } from "react-redux"
import Actions from "actions/world"
import classnames from "classnames"

import "./styles.css"

const HistoryItem = ({ text, stepN, selected, defining, firstDefining, revert, setDefineN, resetDefineN, openDefine, doubleClick, tentative }) => (
  <div
    onClick={() => revert()}
    className={classnames("HistoryItem", {"selected": selected, "defining": defining, "firstDefining": firstDefining, "tentative": tentative})}>
    <div
      className="HistoryItem-num"
      onMouseEnter={() => setDefineN()}
      onMouseLeave={() => resetDefineN()}
      onClick={(e) => { e.stopPropagation(); openDefine() }}
      onDoubleClick={() => doubleClick()}
    >
      {stepN}
    </div>
    <div className="HistoryItem-text">{text}</div>
  </div>
)

const HistoryPin = ({ text, head, openDefine, defining, remove }) => {
  if (defining) return false

  return (
    <div className={classnames("HistoryPin", {"head": head})}>
      {text}
      <div className="HistoryPin-remove" onClick={(e) => { e.stopPropagation(); remove() }}>&times;</div>
      {head &&
        <button onClick={(e) => { e.stopPropagation(); openDefine()}}>Define This</button>
      }
    </div>
  )
}

HistoryPin.propTypes = {
  text: PropTypes.string,
  head: PropTypes.bool,
  openDefine: PropTypes.func,
  defining: PropTypes.bool
}

class History extends Component {
  static propTypes = {
    history: PropTypes.array,
    current_history_idx: PropTypes.number,
    defineN: PropTypes.number,
    defining: PropTypes.bool,

    dispatch: PropTypes.func
  }

  revert(realIdx) {
    this.props.dispatch(Actions.revert(realIdx))
  }

  setDefineN(idx) {
    const firstPinIdx = this.props.history.findIndex(h => h.type === "pin")
    if (!this.props.defining && (firstPinIdx < 0 || idx > firstPinIdx))
      this.props.dispatch(Actions.setDefineN(idx))
  }

  deletePin(idx) {
    this.props.dispatch(Actions.removePin(idx))
  }

  setPin() {
    this.props.dispatch(Actions.setPin())
  }

  openDefine(realIdx) {
    if (this.props.defining) return false

    const { dispatch, history } = this.props

      /* Put the application into define mode */
    const item = history[realIdx]
    if (item.type === "pin") {
      if (realIdx === history.length - 1) {
        alert("You cannot define the first history item because you must have something to define it as!")
        return
      }

      dispatch(Actions.setQuery(item.text))
    } else {
      /* If the item is not a pin, we need to inject a pin before the thing we are defining */
      dispatch(Actions.injectPin(realIdx))
    }
    dispatch(Actions.setStatus("define"))
    dispatch(Actions.openDefine(realIdx))
  }

  render() {
    const { history, current_history_idx, defineN, defining, status, query } = this.props

    const firstPinIdx = history.findIndex(h => h.type === "pin")

    return (
      <div className={classnames("History", {"defineMode": defining})}>
        {history.map((h, idx) => {
          const stepN = idx + 1

          if (h.type === "pin") return (
            <HistoryPin
              key={idx}
              text={h.text}
              head={idx === firstPinIdx}
              openDefine={() => this.openDefine(idx)}
              defining={defineN && idx === defineN}
              remove={() => this.deletePin(idx)}
            />
          )
          return (
            <HistoryItem
              key={idx}
              text={h.text}
              stepN={stepN}
              selected={current_history_idx === idx}
              defining={defineN && idx >= defineN}
              firstDefining={defineN && idx - 1 === defineN}
              revert={() => this.revert(idx)}
              setDefineN={() => this.setDefineN(idx)}
              resetDefineN={() => this.setDefineN(null)}
              openDefine={() => this.openDefine(idx)}
              doubleClick={() => console.log(h)}
            />
          )
        })}
        {status === "accept" &&
          <HistoryItem
            key="new"
            text={query}
            stepN={history.length + 1}
            revert={() => this.setPin()}
            openDefine={() => this.setPin()}
            tentative
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  history: state.world.history,
  current_history_idx: state.world.current_history_idx,
  defineN: state.world.defineN,
  defining: state.world.defining,
  status: state.world.status,
  query: state.world.query
})

export default connect(mapStateToProps)(History)

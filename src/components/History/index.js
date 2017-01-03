import React, { Component, PropTypes } from "react"
import { connect } from "react-redux"
import Actions from "actions/world"
import classnames from "classnames"

import "./styles.css"

const HistoryItem = ({ text, stepN, selected, defining, lastDefining, revert, setDefineN, resetDefineN, openDefine, doubleClick }) => (
  <div
    onClick={() => revert()}
    className={classnames("HistoryItem", {"selected": selected, "defining": defining, "lastDefining": lastDefining})}>
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
    const { history, current_history_idx, defineN, defining } = this.props

    const historyItems = history.slice().reverse()
    const firstPinIdx = historyItems.findIndex(h => h.type === "pin")

    return (
      <div className={classnames("History", {"defineMode": defining})}>
        {historyItems.map((h, idx) => {
          const realIdx = historyItems.length - idx - 1
          const stepN = historyItems.length - idx

          if (h.type === "pin") return (
            <HistoryPin
              key={idx}
              text={h.text}
              head={idx === firstPinIdx}
              openDefine={() => this.openDefine(realIdx)}
              defining={defineN && realIdx === defineN}
              remove={() => this.deletePin(realIdx)}
            />
          )
          return (
            <HistoryItem
              key={idx}
              text={h.text}
              stepN={stepN}
              selected={current_history_idx === realIdx}
              defining={defineN && realIdx >= defineN}
              lastDefining={defineN && realIdx - 1 === defineN}
              revert={() => this.revert(realIdx)}
              setDefineN={() => this.setDefineN(realIdx)}
              resetDefineN={() => this.setDefineN(null)}
              openDefine={() => this.openDefine(realIdx)}
              doubleClick={() => console.log(h)}
            />
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  history: state.world.history,
  current_history_idx: state.world.current_history_idx,
  defineN: state.world.defineN,
  defining: state.world.defining
})

export default connect(mapStateToProps)(History)

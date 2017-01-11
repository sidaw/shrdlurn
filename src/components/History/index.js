import React, { Component, PropTypes } from "react"
import { connect } from "react-redux"
import Actions from "actions/world"
import classnames from "classnames"

import "./styles.css"

const HistoryItem = ({ text, stepN, selected, defining, firstDefining, revert, setDefineN, resetDefineN, openDefine, doubleClick, tentative, last, remove, setPin }) => (
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
    <div className="HistoryItem-text">
      {text}
      {last &&
        <div className="HistoryPin-remove" onClick={(e) => { e.stopPropagation(); remove() }}>&times;</div>
      }
      {(last || tentative) && !defining &&
        <button onClick={(e) => { e.stopPropagation(); setPin()}}>Define This</button>
      }
    </div>
  </div>
)

const HistoryPin = ({ text, head, define, defining, remove, query }) => {
  return (
    <div className={classnames("HistoryPin", {"head": head})}>
      {!defining ?
        text
      :
        query !== "" ? query : <span>&nbsp;</span>
      }
      <div className="HistoryPin-remove" onClick={(e) => { e.stopPropagation(); remove() }}>&times;</div>
      {head &&
        <button onClick={(e) => { e.stopPropagation(); define()}}>Finish Definition</button>
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
    query: PropTypes.string,

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
    this.props.dispatch(Actions.closeDefine())
  }

  setPin() {
    this.props.dispatch(Actions.acceptNone(this.props.query))
    this.props.dispatch(Actions.setPin())
  }

  markPin(idx) {
    this.props.dispatch(Actions.acceptNone(this.props.history[idx].text))
    this.props.dispatch(Actions.markPin(idx))
  }

  removeLast() {
    this.props.dispatch(Actions.removeLast())
  }

  openDefine(realIdx) {
    if (this.props.defining || realIdx === 0) return false

    const { dispatch } = this.props

    /* If the item is not a pin, we need to inject a pin before the thing we are defining */
    dispatch(Actions.injectPin(realIdx))
    dispatch(Actions.setStatus("define"))
    dispatch(Actions.openDefine(realIdx))
  }

  define(idx) {
    const { history, dispatch } = this.props
    if (idx === history.length - 1) {
      alert("You cannot define the first history item because you must have something to define it as!")
      return
    }
    const text = history[idx].text
    const query = text !== "" ? text : this.props.query
    dispatch(Actions.define(query, idx))
  }

  render() {
    const { history, current_history_idx, defineN, defining, status, query } = this.props

    const lastPinIdx = history.length - 1 - history.slice().reverse().findIndex(h => h.type === "pin")

    return (
      <div className={classnames("History", {"defineMode": defining})}>
        {history.map((h, idx) => {
          const stepN = idx + 1

          if (h.type === "pin") return (
            <HistoryPin
              key={idx}
              text={h.text}
              head={idx === lastPinIdx}
              define={() => this.define(idx)}
              defining={defineN && idx === defineN}
              remove={() => this.deletePin(idx)}
              query={defining ? query : null}
            />
          )
          return (
            <HistoryItem
              key={idx}
              text={h.text}
              stepN={stepN}
              selected={current_history_idx === idx}
              defining={idx >= lastPinIdx || (defineN && idx >= defineN)}
              firstDefining={defineN && idx - 1 === defineN}
              revert={() => this.revert(idx)}
              setDefineN={() => this.setDefineN(idx)}
              resetDefineN={() => this.setDefineN(null)}
              openDefine={() => this.openDefine(idx)}
              doubleClick={() => console.log(h)}
              last={idx !== 0 && idx === history.length - 1}
              remove={() => this.removeLast()}
              setPin={() => this.markPin(idx)}
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
            setPin={() => this.setPin()}
            tentative
            setDefineN={() => {}}
            resetDefineN={() => {}}
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

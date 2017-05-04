import React, { Component, PropTypes } from "react"
import { connect } from "react-redux"
import Actions from "actions/world"
import classnames from "classnames"
import { STATUS, DEFINE_THIS, FINISH_DEFINITION } from "constants/strings"

import "./styles.css"

class HistoryItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.text !== nextProps.text || this.props.stepN !== nextProps.stepN ||
      this.props.selected !== nextProps.selected || this.props.defining !== nextProps.defining ||
      this.props.firstDefining !== nextProps.firstDefining || this.props.tentative !== nextProps.tentative ||
      this.props.last !== nextProps.last) {
      return true
    }
    return false
  }

  render() {
    const { text, stepN, selected, defining, firstDefining, revert, setDefineN, resetDefineN, openDefine, doubleClick, tentative, last, remove, setPin } = this.props

    return (
      <div
        onClick={() => revert()}
        className={classnames("HistoryItem", { "selected": selected, "defining": defining, "firstDefining": firstDefining, "tentative": tentative })}>
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
          {last &&
            <div className="HistoryPin-remove" onClick={(e) => { e.stopPropagation(); remove() }}>&times;</div>
          }
          <div className="HistoryItem-text-text">{text}</div>
          {(last || tentative) && !defining &&
            <button onClick={(e) => { e.stopPropagation(); setPin() }}>{DEFINE_THIS}</button>
          }
        </div>
      </div>
    )
  }
}

const HistoryPin = ({ text, head, define, defining, remove, query }) => {
  return (
    <div className={classnames("HistoryPin", { "head": head })}>
      {!defining ?
        text
        :
        query !== "" ? query : <span>&nbsp;</span>
      }
      <div className="HistoryPin-remove" onClick={(e) => { e.stopPropagation(); remove() }}>&times;</div>
      {head &&
        <button onClick={(e) => { e.stopPropagation(); define() }}>{FINISH_DEFINITION}</button>
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
    status: PropTypes.string,

    dispatch: PropTypes.func
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  shouldComponentUpdate(nextProps) {
    /* Update if history or idx or defineN or defining change always */
    if (this.props.history.length !== nextProps.history.length ||
      this.props.current_history_idx !== nextProps.current_history_idx ||
      this.props.defineN !== nextProps.defineN ||
      this.props.defining !== nextProps.defining ||
      this.props.status !== nextProps.status) {
      return true
    } else if ((this.props.defining || nextProps.defining) && this.props.query !== nextProps.query) {
      /* update if query changed when defining */
      return true
    } else if (this.props.history[this.props.history.length - 1].type !== nextProps.history[nextProps.history.length - 1].type) {
      /* update if define this button has been clicked */
      return true
    }

    /* otherwise, don't update */
    return false
  }

  scrollToBottom() {
    this.refs.list.scrollTop = this.refs.list.scrollHeight;
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
    dispatch(Actions.setStatus(STATUS.DEFINE))
    dispatch(Actions.openDefine(realIdx))
  }

  define(idx) {
    this.props.dispatch(Actions.define(idx))
  }

  render() {
    const { history, current_history_idx, defineN, defining, status, query } = this.props

    const lastPinIdx = history.length - 1 - history.slice().reverse().findIndex(h => h.type === "pin")

    return (
      <div className={classnames("History", { "defineMode": defining })} ref="list">
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
        {status === STATUS.ACCEPT &&
          <HistoryItem
            key="new"
            text={query}
            stepN={history.length + 1}
            revert={() => this.setPin()}
            openDefine={() => this.setPin()}
            setPin={() => this.setPin()}
            tentative
            setDefineN={() => { }}
            resetDefineN={() => { }}
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

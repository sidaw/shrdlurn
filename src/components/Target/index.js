import React from "react"
import classnames from "classnames"
import Blocks from "setting"

import "./styles.css"

class Target extends React.Component {
  static propTypes = {
    target: React.PropTypes.array,
    possibleSteps: React.PropTypes.number
  }

  constructor(props) {
    super(props)

    this.state = { collapsed: false }
  }

  render() {
    const { target, possibleSteps } = this.props

    return (
      <div className={classnames("SidePanel Target", { "collapsed": this.state.collapsed })}>
        <div className="SidePanel-header">
          <span className="SidePanel-header-name">Target</span>
          <div onClick={() => this.setState({ collapsed: !this.state.collapsed })} className="Target-header-arrow">
            {(() => {
              if (this.state.collapsed) return (<span>&larr;</span>)
              return (<span>&rarr;</span>)
            })()}
          </div>
        </div>
        <div className="Target-struct">
          <Blocks blocks={target} width={660} height={480} isoConfig={{ canvasWidth: 660, canvasHeight: 480, numUnits: 20 }} />
        </div>
        <div className="Target-metadata">
          <div key="poss"><strong>{possibleSteps}</strong>&nbsp;possible steps</div>
          <div key="max"><strong>{possibleSteps * 3}</strong>&nbsp;maximum steps</div>
        </div>
      </div>
    )
  }
}

export default Target

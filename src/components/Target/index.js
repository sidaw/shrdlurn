import React from "react"
import Blocks from "components/Blocks"

import "./styles.css"

const Target = ({ target, possibleSteps }) => {
  return (
    <div className="Target">
      <div className="Target-header">Target</div>
      <div className="Target-struct">
        <Blocks blocks={target} isoConfig={{scale: 0.6, offset: 0}} width={660} height={480} />
      </div>
      <div className="Target-metadata">
        <div key="poss"><strong>{possibleSteps}</strong>&nbsp;possible steps</div>
        <div key="max"><strong>{possibleSteps * 3}</strong>&nbsp;maximum steps</div>
      </div>
    </div>
  )
}

export default Target

import React from "react"
import Blocks, { computeDiff, computeEquality } from "./BlocksWorld"

import "./styles.css"

export const diff = computeDiff
export const equalityCheck = computeEquality

/* Must render the currentState */
const Setting = (props) => (
  <Blocks {...props} />
)

export default Setting
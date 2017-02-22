import React from "react"
import { Link } from "react-router"

import "./styles.css"

const About = () => (
  <div className="About">
    <div>
      <h1>Welcome to VOXELURN!</h1>
      <Link to="/build"><button className="active">Start Building!</button></Link>
    </div>
  </div>
)

export default About
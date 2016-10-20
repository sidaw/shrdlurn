import React from 'react'

import "normalize.css"
import "./styles.css"

const Layout = ({children}) => (
  <div className="container">
    {children}
  </div>
)

Layout.propTypes = {
  children: React.PropTypes.object
}

export default Layout

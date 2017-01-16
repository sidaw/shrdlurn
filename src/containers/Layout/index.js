import React from 'react'
import Header from "components/Header"

import "normalize.css"
import "./styles.css"

const Layout = ({children}) => (
  <div className="container">
    <Header />
    {children}
  </div>
)

Layout.propTypes = {
  children: React.PropTypes.object
}

export default Layout

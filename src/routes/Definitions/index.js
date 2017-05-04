import React, { Component } from "react"
import { connect } from "react-redux"
import Actions from "actions/logger"
import classnames from "classnames"

import "./styles.css"

const flattenSearch = (list, term) => list.reduce((a, b) => {
  if (Array.isArray(b)) {
    return a.concat(flattenSearch(b, term))
  } else if (b.includes(term)) {
    return a.concat(b)
  }
  return a
}, [])

class Definitions extends Component {
  constructor(props) {
    super(props)

    this.state = { search: "", highlight: null }
  }

  componentDidMount() {
    this.props.dispatch(Actions.getDefinitions())
  }

  scrollTo(id) {
    this.setState({ search: "", highlight: id })
    const element = document.getElementById(id)
    element.scrollIntoView(true)
    const scrolledY = window.scrollY
    if (scrolledY)
      window.scroll(0, scrolledY - 100)
  }

  search() {
    const search = this.refs.search.value
    this.setState({ search })
  }

  render() {
    let defKeys = Object.keys(this.props.definitions)

    if (defKeys.length === 0)
      return (
        <div className="Definitions"><div className="Community-header"><h3>Definitions</h3></div>Loading...</div>
      )

    return (
      <div className="Definitions">
        <div className="Community-header">
          <h3>Definitions</h3>
        </div>
        <div className="Definitions-search">
          <input placeholder="Search" type="text" ref="search" />
          <button type="button" className="active" onClick={() => this.search()}>Search</button>
        </div>
        {defKeys.map(s => {
          const d = this.props.definitions[s]


          const { search } = this.state
          if (search && search !== "" && flattenSearch(d.body.concat(d.head), search).length === 0)
            return false

          return (
            <div key={s} id={s} className={classnames("Definition", { "highlight": this.state.highlight === s })}>
              {d.head.join(" ")}
              <div>
                {d.body.map((b, idx) => (
                  <span key={idx} className="Step">
                    {b.map((t, idx) => {
                      if (typeof t === "string") {
                        return (<span key={idx}>{t}&nbsp;</span>)
                      } else {
                        return (
                          <a
                            key={idx}
                            onClick={() => this.scrollTo(t[0])}
                            className={classnames({ "nomatch": t[0] === "(no_match)" || t[0] === "(no_parse)" })}
                          >
                            {t.slice(1).join(" ")}&nbsp;
                          </a>
                        )
                      }
                    })}
                    {idx !== b.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          )
        })
        }
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  definitions: state.logger.definitions
})

export default connect(mapStateToProps)(Definitions)
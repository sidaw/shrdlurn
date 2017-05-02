import React, { Component } from "react"
import { connect } from "react-redux"
import Actions from "actions/logger"
import Viz from "viz.js"

import "./styles.css"

function escapeSymbol(symbol) {
  return symbol.replace(/(\W)/g, (a, b) => {
    if (b === "<") return "SYMlt"
    else if (b === ">") return "SYMgt"
    else if (b === "[") return "SYMbl"
    else if (b === "]") return "SYMbr"
    else if (b === "*") return "SYMa"
    else if (b === "{") return "SYMcl"
    else if (b === "}") return "SYMBcr"
    else if (b === '"') return "SYMq"
    else if (b === "'") return "SYMqq"
    else if (b === "$") return "SYMd"
    else return "SYM"
  })
}

function createGraphFromDefinitions(definitions) {
  let edges = []

  let graph = `
  digraph erd {
  graph [
    rankdir = "LR"
  ];
  node [
    fontsize = "16"
    shape = "plaintext"
  ]; 
  edge [

  ];

  `

  let i = 0
  for (const symbol of Object.keys(definitions)) {
    // if (i < 48) { i += 1; continue }
    const definition = definitions[symbol]
    const cleanSymbol = escapeSymbol(symbol)
    graph += `${cleanSymbol} [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0">`
    graph += `<TR><TD><B>${definition.head.join(" ")}</B></TD></TR>`

    let uniques = 0
    for (const step of definition.body) {
      if (typeof step[0] === "string") {
        graph += `,<TR><TD>${step.join(" ")}</TD></TR>`
      } else {
        const inferred = step[0]
        const linkedSymbol = escapeSymbol(inferred[0])
        graph += `,<TR><TD PORT="${linkedSymbol}${uniques}">${inferred.slice(1).join(" ")}</TD></TR>`
        edges.push(`${cleanSymbol}:${linkedSymbol}${uniques} -> ${linkedSymbol}`)
        uniques += 1
      }
    }

    graph += `</TABLE>>];\n`

    i += 1
    if (i > 100) break
  }

  for (const edge of edges)
    graph += edge + "\n"

  graph += "\n}"
  console.log(graph)
  return graph
}

class Definitions extends Component {
  componentDidMount() {
    this.props.dispatch(Actions.getDefinitions())
  }

  componentDidUpdate() {
    const graph = createGraphFromDefinitions(this.props.definitions)
    const image = Viz(graph, { format: "png-image-element" });
    this.refs.graph.appendChild(image);
  }

  scrollTo(id) {
    const element = document.getElementById(id)
    element.scrollIntoView(true)
  }

  render() {
    if (Object.keys(this.props.definitions).length === 0)
      return (
        <div className="Definitions"><div className="Community-header"><h3>Definitions</h3></div>Loading...</div>
      )

    return (
      <div className="Definitions">
        <div className="Community-header">
          <h3>Definitions</h3>
        </div>
        <div className="Definitions-graph" ref="graph" />
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  definitions: state.logger.definitions
})

export default connect(mapStateToProps)(Definitions)
import React, { Component } from "react"
import Blocks from "components/Blocks"
import Actions from "actions/logger"
import { connect } from "react-redux"
import classnames from "classnames"

import "./styles.css"

const Structure = ({ blocks, recipe, upvotes, upVote, sessionId, uid, id }) => {
  return (
    <div className="SharedStructures-row">
      <div className="SharedStructures-votes">
        {upvotes.indexOf(sessionId) === -1 &&
          <div className="SharedStructures-votes-upvote" onClick={() => upVote()}>&#9650;</div>
        }
        <div className="SharedStructures-votes-tally">{upvotes.length}</div>
        <div className="SharedStructures-votes-desc">upvotes</div>
      </div>
      <div className={classnames("SharedStructures-struct", {"highlight": sessionId === id})}>
        <div className="SharedStructures-struct-id">{uid}</div>
        <div className="SharedStructures-struct-blocks">
          <Blocks blocks={blocks} width={330} height={240} isoConfig={{offset:-1, scale: 0.2}} />
        </div>
        <div className="SharedStructures-struct-recipe">
          {recipe.map((r, idx) => (
            <span key={idx}>{r}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

class SharedStructures extends Component {
  handleUpvote(id, idx) {
    this.props.dispatch(Actions.upvote(id, idx))
  }

  cmpScore(a, b) {
    if (a.score < b.score) {
      return 1
    } else if (a.score > b.score) {
      return -1
    } else {
      return 0
    }
  }

  render() {
    return (
      <div className="SharedStructures">
        <div className="Community-header">
          <h3>Top Structures</h3>
          <p>Upvote the best and most interesting structures (and submit your own)!</p>
        </div>
        <div className="Community-content">
          {this.props.structs.length > 0 ?
            this.props.structs.sort((a, b) => {
              if (a.score < b.score) {
                return 1
              } else if (a.score > b.score) {
                return -1
              } else {
                return 0
              }
            }).map((s, idx) => {
              return (
                <Structure
                  key={s.uid + "-" + s.id}
                  uid={s.uid}
                  id={s.id}
                  blocks={s.value}
                  recipe={s.recipe}
                  upvotes={s.upvotes}
                  upVote={() => this.handleUpvote(s.uid, s.id)}
                  sessionId={this.props.sessionId}
                />
              )
            })
          :
            <span>No structs shared yet. Be the first!</span>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sessionId: state.user.sessionId
})

export default connect(mapStateToProps)(SharedStructures)

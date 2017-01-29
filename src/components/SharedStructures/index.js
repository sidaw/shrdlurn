import React, { Component, PureComponent, PropTypes } from "react"
import Blocks from "components/Blocks"
import Actions from "actions/logger"
import { connect } from "react-redux"
import classnames from "classnames"

import "./styles.css"

class Structure extends PureComponent {
  static propTypes = {
    blocks: PropTypes.array,
    recipe: PropTypes.array,
    upvotes: PropTypes.array,
    sessionId: PropTypes.string,
    uid: PropTypes.string,
    id: PropTypes.string,
    upVote: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = { big: false }
  }

  // shouldComponentUpdate(nextProps) {
  //   /* Only upvote if upvotes changes, because we know the rest is static */
  //   console.log(this.props.uid, this.props.id, nextProps.upvotes.length, this.props.upvotes.length)
  //   if (nextProps.upvotes.length !== this.props.upvotes.length) {
  //     console.log("Woot")
  //     return true
  //   }
  //
  //   return false
  // }

  toggleBig() {
    this.setState({ big: !this.state.big })
  }

  render() {
    const { upvotes, sessionId, blocks, upVote, uid, id, recipe } = this.props

    return (
      <div className="SharedStructures-row">
        <div className="SharedStructures-votes">
          {upvotes.indexOf(sessionId) === -1 &&
            <div className="SharedStructures-votes-upvote" onClick={() => upVote()}>&#9650;</div>
          }
          <div className="SharedStructures-votes-tally">{upvotes.length}</div>
          <div className="SharedStructures-votes-desc">upvotes</div>
        </div>
        <div
          className={classnames("SharedStructures-struct", {"highlight": sessionId === uid})}
        >
          <div className="SharedStructures-struct-id">{uid.slice(0, 8)} #{id}</div>
          <div className="SharedStructures-struct-blocks" onClick={() => this.toggleBig()}>
            <Blocks blocks={blocks} width={330} height={240} isoConfig={{canvasWidth: 330, canvasHeight: 240, numUnits:30}} />
          </div>
          <div className="SharedStructures-struct-recipe">
            {recipe.map((r, idx) => (
              <span key={idx}>{r}</span>
            ))}
          </div>
        </div>

        {this.state.big &&
          <div className="modal-container SharedStructures-bigstruct">
            <div className="modal">
              <div className="modal-header">
                {uid} #{id}
                <div className="modal-escape" onClick={() => this.toggleBig()}>
                  &times;
                </div>
              </div>
              <div className="modal-body">
                <Blocks blocks={blocks} width={1650} height={1200} isoConfig={{canvasWidth: 1650, canvasHeight: 1200, numUnits:30}}/>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
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
          {this.props.structs === "loading" ?
            <span>Loading structs from the server...</span>
          :
            this.props.structs.length > 0 ?
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
                    key={idx}
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

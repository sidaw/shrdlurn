import React, { Component } from "react"
import { connect } from "react-redux"
import Actions from "actions/logger"
import { Link } from "react-router"
import "./styles.css"

class Information extends Component {
  componentDidMount() {
    this.props.dispatch(Actions.joinCommunity())
  }

  render() {
		const height = "150px";
    return (
      <div className="Information">
			<img src={require('./struct_frames_cubes.png')} height={height}/>
				<p>Voxelurn is a command interface for building {' '}
				<Link to={{ pathname: "/community", query: this.props.query }} activeClassName="active" target="_blank">voxel structures</Link>.{' '}
				It is an experimental platform for developing technologies
				allowing computers to understand a naturalized programming language, which allows people to access
				to the power of programming languages
				without conforming to their uncompromising syntax.{' '}
				Voxlurn does this by learning from its user community interactively.
				</p>

				{/*
					<div className="Examples">
					<img src={require('./examples.png')} height={height}/>
				<img src={require('./struct_monster_inc.png')} height={height}/>
				<img src={require('./struct_frames_cubes.png')} height={height}/>
				<img src={require('./struct_venison.png')} height={height}/>
				</div>
				*/}


				<h2>Prizes</h2>
				<p>
				We award prizes for users contributing the most useful language, and users building the best structures.
				Six $50 prizes are handed out every two weeks for the top 3 language teachers and the top 3 best structures.
				To participate, you have to <a target="_blank" href="https://shrdlurn.signup.team/">join</a> our <a target="_blank" href="https://shrdlurn.slack.com/">slack channel</a> and login.
				More details on the competition can be found there.
				</p>

				<h2>Get started</h2>
				Head over to the build page and type "repeat 3 [add red top]".
				Voxelurn always understand a core language.
				However, you might find the core language annoying to remember and to learn,
				and you can describe an action in a way you want: "add red top 3 times" and teach voxlurn.
				A short tutorial video contains more details on how this works.
				<h2>Learn more</h2>
				More information can be found on <a href="https://github.com/sidaw/shrdlurn">github</a>.
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  structs: state.logger.structs,
  utterances: state.logger.utterances,
  topBuilders: state.logger.topBuilders
})

export default connect(mapStateToProps)(Information)

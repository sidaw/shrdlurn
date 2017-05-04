import React, { Component } from "react"
import { connect } from "react-redux"
import Actions from "actions/logger"
import { Link } from "react-router"
import "./styles.css"
import { TUTORIAL_URL, SLACK_SIGNUP_URL, DOCUMENTATION_URL } from "constants/strings"

import CubesImage from "images/struct_frames_cubes.png"

class Information extends Component {
	componentDidMount() {
		this.props.dispatch(Actions.joinCommunity())
	}

	render() {
		const height = "150px";
		return (
			<div className="About">
				<div>
					<img src={CubesImage} alt="example voxel structure" height={height} />
					<p>Voxelurn is a command interface for building {' '}
						<Link to={{ pathname: "/community", query: this.props.query }} activeClassName="active" target="_blank">voxel structures</Link>.{' '}
						It is an experimental platform for developing techniques
    				allowing computers to parse a naturalized programming language.
            Our goal is to allow people access
    				to the power of programming languages
    				without conforming to their uncompromising syntax.{' '}
						Voxlurn does this by learning from its user community interactively starting from a precise programming language.
				</p>
        <h2>Get started</h2>
      <ul>
       <li> Go to the <Link to="/build">build page</Link> and type "repeat 3 [add red top]". </li>
       <li>Voxelurn always understands the <a target="_blank" href={DOCUMENTATION_URL}>core language</a>, which has a fixed syntax like other programming languages.</li>
       <li> You can define
      "add red top 3 times" by clicking the "Define this" button and then enter "repeat 3 [add red top]".
      You can now use
      "add green left 5 times". </li>
      <li>Alternatively, you can use the mouse to select to select some previous commands and define them.</li>
      <li>See how definitions works in our <a target="_blank" href={TUTORIAL_URL}>overview video</a>.</li>
      <li>Previous users already defined some concepts and used them to build {' '}
      <Link to={{ pathname: "/community", query: this.props.query }} activeClassName="active" target="_blank">voxel structures</Link>.</li>
       </ul>
					{/*
					<div className="Examples">
					<img src={require('./examples.png')} height={height}/>
				<img src={require('./struct_monster_inc.png')} height={height}/>
				<img src={require('./struct_frames_cubes.png')} height={height}/>
				<img src={require('./struct_venison.png')} height={height}/>
				</div>
				*/}
				{/*
        <h2>Prizes</h2>
				<p>
				We award prizes for users contributing the most useful language, and users building the best structures.
				Six $50 prizes are handed out every two weeks for the top 3 language teachers and the top 3 best structures.
				To participate, you have to <a target="_blank" href="https://shrdlurn.signup.team/">join</a> our <a target="_blank" href="https://shrdlurn.slack.com/">slack channel</a> and login.
				More details on the competition can be found there.
				</p>
        */}

				<h2>More...</h2>
        <ul>
        <li><a target="_blank" href={TUTORIAL_URL}>Video overview</a>: see the system at work</li>
        <li><a target="_blank" href={DOCUMENTATION_URL}>Documentation</a>: core language, the setup, etc </li>
        <li><Link to={{ pathname: "/definitions" }} activeClassName="active" target="_blank">Definitions</Link>: existing definitions</li>
        <li><a target="_blank" href={SLACK_SIGNUP_URL}> Slack</a> (<a target="_blank" href="https://shrdlurn.signup.team/">signup</a>): signup and join to submit more structures and win prizes</li>
        <li><a target="_blank" href="https://github.com/sidaw/shrdlurn/blob/master/Voxelurn.md#defined-by-users">Examples</a>: actions and structures defined by users</li>
        <li><a target="_blank" href="https://arxiv.org/abs/1704.06956">Our paper</a></li>
        </ul>
        </div></div>
		)
	}
}

const mapStateToProps = (state) => ({
	structs: state.logger.structs,
	utterances: state.logger.utterances,
	topBuilders: state.logger.topBuilders
})

export default connect(mapStateToProps)(Information)

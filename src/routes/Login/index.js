import { hashHistory } from "react-router"
import { connect } from "react-redux"
import Actions from "actions/logger"

const Login = ({ location: { query: { code } }, dispatch }) => {
  // Sign in action
  dispatch(Actions.signIn(code))

  // Redirect to build as we sign in
  hashHistory.push('/build')

  return false
}

export default connect()(Login)
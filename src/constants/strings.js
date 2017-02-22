/* Server URLs */
const DEFAULT_SEMPRE_SERVER_URL = "http://jonsson.stanford.edu:8410"
const DEFAULT_COMMUNITY_SERVER_URL = "http://jonsson.stanford.edu:8403"
export const SEMPRE_SERVER_URL = process.env.REACT_APP_SEMPRE_SERVER ? process.env.REACT_APP_SEMPRE_SERVER : DEFAULT_SEMPRE_SERVER_URL
export const COMMUNITY_SERVER_URL = process.env.REACT_APP_COMMUNITY_SERVER ? process.env.REACT_APP_COMMUNITY_SERVER : DEFAULT_COMMUNITY_SERVER_URL

/* Header URLs */
export const TUTORIAL_URL = "https://youtu.be/0MH2aILyOxA"
export const SLACK_SIGNUP_URL = "https://shrdlurn.signup.team/"

/* Meta information */
export const DEFAULT_SESSIONID = "deadbeef"

/* Control strings */
export const STATUS = {
  TRY: "TRY",
  ACCEPT: "ACCEPT",
  DEFINE: "DEFINE",
  LOADING: "LOADING"
}

/* Display Strings */
export const COMMAND_BAR_PLACEHOLDER = "Tell the computer to build something..."
export const COMMAND_BAR_DEFINE_PLACEHOLDER = "Define this set of actions as..."
export const TRY_MSG = "Enter a command for the computer."
export const ACCEPT_MSG = "Click accept if the computer correctly intepreted what you meant, scroll to see other intepretations, or revise your command."
export const DEFINE_MSG = "Define the highlighted set of actions as this phrase (e.g. build a chair)."
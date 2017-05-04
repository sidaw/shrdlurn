/* Server URLs */
const DEFAULT_SEMPRE_SERVER_URL = "http://jonsson.stanford.edu:8410"
const DEFAULT_COMMUNITY_SERVER_URL = "http://jonsson.stanford.edu:8403"
export const SEMPRE_SERVER_URL = process.env.REACT_APP_SEMPRE_SERVER ? process.env.REACT_APP_SEMPRE_SERVER : DEFAULT_SEMPRE_SERVER_URL
export const COMMUNITY_SERVER_URL = process.env.REACT_APP_COMMUNITY_SERVER ? process.env.REACT_APP_COMMUNITY_SERVER : DEFAULT_COMMUNITY_SERVER_URL

/* Header URLs */
export const TUTORIAL_URL = "https://youtu.be/7clXX0g3Znw"
export const SLACK_SIGNUP_URL = "https://shrdlurn.slack.com/"
export const SLACK_OAUTH_URL = "https://slack.com/oauth/authorize?scope=identity.basic,identity.email&client_id=130265636855.151294060356&redirect_uri=" + (process.env.NODE_ENV === "development" ? "http%3A%2F%2Flocalhost%3A3000%2F%23%2Flogin" : "http%3A%2F%2Fwww.voxelurn.com%2F%23%2Flogin")
export const DOCUMENTATION_URL = "https://github.com/sidaw/shrdlurn/blob/master/Voxelurn.md"

/* Meta information */
export const DEFAULT_SESSIONID = "deadbeef"

/* Control strings */
export const STATUS = {
  TRY: "TRY",
  ACCEPT: "ACCEPT",
  DEFINE: "DEFINE",
  LOADING: "LOADING"
}

/* Important Variables */
export const CUBE_MINIMUM = 50

/* Display Strings */
export const COMMAND_BAR_PLACEHOLDER = "Tell the computer to build something..."
export const COMMAND_BAR_DEFINE_PLACEHOLDER = "Define this set of actions as..."
export const TRY_MSG = "Enter a command for the computer."
export const ACCEPT_MSG = "Click accept if the computer correctly intepreted what you meant, scroll to see other intepretations, or revise your command."
export const DEFINE_MSG = "Define the highlighted set of actions as this phrase (e.g. build a chair)."
export const DEFINE_THIS = "Define This"
export const FINISH_DEFINITION = "Finish Definition"
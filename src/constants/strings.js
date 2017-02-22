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

/* Display Strings */
// ...
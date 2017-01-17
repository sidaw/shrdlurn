const Strings = {
  DEFAULT_SESSIONID: "deadbeef",
  TUTORIAL_URL: "https://youtu.be/FvEdK_tUoWM"
}

Strings["LOGGER_URL"] = process.env.REACT_APP_SERVER === "local" ? "localhost:8408" : "http://jonsson.stanford.edu:8408"

export default Strings

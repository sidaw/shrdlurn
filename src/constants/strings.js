const Strings = {
  DEFAULT_SESSIONID: "deadbeef",
  TUTORIAL_URL: "https://www.youtube.com/watch?v=zfuYvBZWj1Q"
}

Strings["LOGGER_URL"] = process.env.REACT_APP_SERVER === "local" ? "localhost:8403" : "http://jonsson.stanford.edu:8403"

export default Strings

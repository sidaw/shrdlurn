const Strings = {
  DEFAULT_SESSIONID: "deadbeef",
  TUTORIAL_URL: "https://youtu.be/0MH2aILyOxA"
}

Strings["LOGGER_URL"] = process.env.REACT_APP_SERVER === "local" ? `localhost:${process.env.REACT_APP_SERVER_PORT}` : `http://jonsson.stanford.edu:${process.env.REACT_APP_SERVER_PORT}`

export default Strings

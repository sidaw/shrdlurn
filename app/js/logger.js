import io from "socket.io-client";
import configs from "./config";

export default class Logger {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.socket = null;

    if (configs.loggerOn) {
      this.socket = io(configs.loggerServer);
      this.socket.on("connect", () => {
        console.log("Logging socket connected");
      });
    }
  }

  log(e) {
    if (this.socket) {
      this.socket.emit("log", { sessionId: this.sessionId.replace(/&/g, "amp;"), timestamp: Date.now(), type: e.type, message: e.msg.join("%") });
    }
  }

  strip(str) {
    // http://stackoverflow.com/questions/14129953/how-to-encode-a-string-in-javascript-for-displaying-in-html
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // submit(username, name, state, steps) {
  //   this.chan.push("struct:submit", { username: this.strip(username), name: this.strip(name), state: JSON.stringify(state), nsteps: steps });
  // }
  //
  // getStructs(Setting, loadStruct) {
  //   if (!configs.loggerOn) { return false; }
  //   this.chan.push("struct:index", {}, 10000)
  //     .receive("ok", (msg) => {
  //       const structs = msg.structs;
  //       const structsList = document.getElementById("user_structs");
  //       structsList.innerHTML = "";
  //       for (let i = 0; i < structs.length; i++) {
  //         const elem = document.createElement("li");
  //         const state = JSON.parse(structs[i].state);
  //         elem.setAttribute("data-state", JSON.stringify(state));
  //         elem.setAttribute("data-nsteps", structs[i].nsteps);
  //         elem.innerHTML = `<canvas id='usercanvas${i}' class='usercanvas' width='400px' height='400px'></canvas><br>by ${this.strip(structs[i].username)}`;
  //         structsList.appendChild(elem);
  //         elem.addEventListener("click", loadStruct);
  //         Setting.renderUserCanvas(state, `usercanvas${i}`);
  //       }
  //     });
  // }
}

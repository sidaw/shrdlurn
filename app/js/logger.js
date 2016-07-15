import { Socket } from "phoenix";
import configs from "./config";

export default class Logger {
  constructor(sessionId) {
    if (configs.loggerOn) {
      const socket = new Socket(configs.loggerServer, {
        logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
      });

      socket.connect();
      socket.onOpen(ev => { console.log("OPEN", ev) });
      socket.onError(ev => { console.log("ERROR", ev) });
      socket.onClose(ev => { console.log("CLOSE", ev) });

      this.chan = socket.channel(`session:${sessionId}`, {});
      this.chan.join();
      this.chan.onError(e => console.log("something went wrong", e));
      this.chan.onClose(e => console.log("channel closed", e));
    }
  }

  log(e) {
    if (configs.loggerOn) {
      const message = `${e.type}:${JSON.stringify(e.msg)}`;
      this.chan.push("log:event", { message: message });
    }
  }

  strip(str) {
    // http://stackoverflow.com/questions/14129953/how-to-encode-a-string-in-javascript-for-displaying-in-html
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  submit(username, name, state, steps) {
    this.chan.push("struct:submit", { username: this.strip(username), name: this.strip(name), state: JSON.stringify(state), nsteps: steps });
  }

  getStructs(Setting, loadStruct) {
    if (!configs.loggerOn) { return false; }
    this.chan.push("struct:index", {}, 10000)
      .receive("ok", (msg) => {
        const structs = msg.structs;
        const structsList = document.getElementById("user_structs");
        structsList.innerHTML = "";
        for (let i = 0; i < structs.length; i++) {
          const elem = document.createElement("li");
          const state = JSON.parse(structs[i].state);
          elem.setAttribute("data-state", JSON.stringify(state));
          elem.setAttribute("data-nsteps", structs[i].nsteps);
          elem.innerHTML = `<canvas id='usercanvas${i}' class='usercanvas' width='400px' height='400px'></canvas><br>by ${this.strip(structs[i].username)}`;
          structsList.appendChild(elem);
          elem.addEventListener("click", loadStruct);
          Setting.renderUserCanvas(state, `usercanvas${i}`);
        }
      });
  }
}

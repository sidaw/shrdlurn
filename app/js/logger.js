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
      const message = `${this.strip(e.type)}:${this.strip(e.msg)}`;
      this.chan.push("log:event", { message: message });
    }
  }

  strip(str) {
    // http://stackoverflow.com/questions/14129953/how-to-encode-a-string-in-javascript-for-displaying-in-html
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

//   this.submit = function(username, name, wall, steps) {
//     this.chan.push('struct:submit', { username: this.strip(username), name: this.strip(name), wall: this.strip(wall), steps: steps });
//   }
//
//   this.getStructs = function() {
//     this.chan.push("struct:index", {}, 10000)
//       .receive("ok", function(msg) {
//         var structs = msg["structs"];
//         var structs_list = document.getElementById("user_structs");
//         structs_list.innerHTML = "";
//         for (var i = 0; i < structs.length; i++) {
//           var elem = document.createElement("li");
//           elem.setAttribute("data-wall", structs[i].wall);
//           elem.setAttribute("data-steps", structs[i].steps);
//           elem.innerHTML = "<canvas id='usercanvas" + i + "' width='100%' height='100px'></canvas><br>" + Logger.strip(structs[i].name) + " by " + Logger.strip(structs[i].username);
//           structs_list.appendChild(elem);
//           elem.addEventListener("click", loadStruct);
//           PS.Main.renderUserTargetJSON("[" + structs[i].wall + "]")("usercanvas" + i)();
//         }
//       });
//   }
// }

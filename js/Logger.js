function Logger() {
  this.socket = new window.Phoenix.Socket(configs.loggerServer, {
    logger: (function(kind, msg, data) { console.log(kind+": "+msg, data) })
  });

  this.init = function(gs) {
    this.socket.connect();
    this.socket.onOpen( function(ev){ console.log("OPEN", ev)} );
    this.socket.onError( function(ev){ console.log("ERROR", ev)} );
    this.socket.onClose( function(ev){ console.log("CLOSE", ev)});

    this.chan = this.socket.channel("session:" + gs.sessionId, {});
    this.chan.join();
  }

  this.log = function(e) {
    var message = this.strip(e.type) + ": " + this.strip(e.msg);
    this.chan.push('log:event', { message: message });
  }

  this.submit = function(username, name, wall, steps) {
    this.chan.push('struct:submit', { username: this.strip(username), name: this.strip(name), wall: this.strip(wall), steps: steps });
  }

  this.strip = function(str) {
    // http://stackoverflow.com/questions/14129953/how-to-encode-a-string-in-javascript-for-displaying-in-html
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  this.getStructs = function() {
    this.chan.push("struct:index", {}, 10000)
      .receive("ok", function(msg) {
        var structs = msg["structs"];
        var structs_list = document.getElementById("user_structs");
        structs_list.innerHTML = "";
        for (var i = 0; i < structs.length; i++) {
          var elem = document.createElement("li");
          elem.setAttribute("data-wall", structs[i].wall);
          elem.setAttribute("data-steps", structs[i].steps);
          elem.innerHTML = Logger.strip(structs[i].name) + " by " + Logger.strip(structs[i].username);
          structs_list.appendChild(elem);
          elem.addEventListener("click", loadStruct);
        }
      });
  }
}

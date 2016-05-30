function Logger() {
  this.socket = new window.Phoenix.Socket(configs.loggerServer, {
    logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
  });

  this.init = function(gs) {
    this.socket.connect();
    this.socket.onOpen( ev => console.log("OPEN", ev) );
    this.socket.onError( ev => console.log("ERROR", ev) );
    this.socket.onClose( e => console.log("CLOSE", e));

    this.chan = this.socket.channel("session:" + gs.sessionId, {});
    this.chan.join();
  }

  this.log = function(e) {
    var message = e.type + ": " + e.msg;
    this.chan.push('log:event', { message: message });
  }
}

const PS = require("../src/Main.purs");

export default class Display {
  constructor() {

  }

  renderTarget(struct) {
    PS.renderTargetJSON(`[${struct}]`)();
  }
}

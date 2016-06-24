import configs from './config';
const PS = require("../src/Main.purs");

export default class Display {
  constructor() {

  }

  setup() {
    const structs = [configs.emptyStruct, configs.emptyStruct];
    this.renderCanvas(structs);
    this.renderTarget(configs.emptyStruct);
  }

  renderTarget(struct) {
    PS.renderTargetJSON(`[${struct}]`)();
  }

  renderCanvas(structs) {
    PS.renderJSON(`[${structs.join(',')}]`)();
  }

  status(msg, query = '') {
    const status = document.getElementById("status");
    const currentcmd = document.getElementById("currentcmd");
    status.innerHTML = msg;

    if (query.length > 0) {
      let stateinfo = `<b>↵: ${query}</b>`;
      // TODO: if Answer: stateinfo = "<b>↵: {query} (#{NBestInd}/{NBestlen})</b>"
      currentcmd.innerHTML = stateinfo;
    }
    else {
      currentcmd.innerHTML = "<b>enter a command</b>";
    }
  }
}

import configs from "./config";
const PS = require("../src/Main.purs");

export default class Setting {
  constructor() {
    const structs = [configs.emptyStruct, configs.emptyStruct];
    this.renderCanvas(structs);
    this.renderTarget(configs.emptyStruct);
  }

  renderTarget(struct) {
    PS.renderTargetJSON(`[${struct}]`)();
  }

  renderCanvas(structs) {
    PS.renderJSON(`[${structs.join(",")}]`)();
  }

  status(msg, query = "", prob = 0) {
    const status = document.getElementById(configs.statusElemId);
    const currentcmd = document.getElementById(configs.currentCmdElemId);
    status.innerHTML = msg;

    if (query.length > 0) {
      const stateinfo = `<b>↵: ${query}</b>`;
      // TODO: if Answer: stateinfo = "<b>↵: {query} (#{NBestInd}/{NBestlen})</b>"
      currentcmd.innerHTML = stateinfo;
    } else {
      currentcmd.innerHTML = "<b>enter a command</b>";
    }

    console.log(prob);
    this.updateReaction(prob);
  }

  updateReaction(prob) {
    const reaction = document.getElementById(configs.reactionElemId);
    if (prob === 0) {
      reaction.innerHTML = this.emojione(3);
    } else {
      let cc = prob;
      if (!cc) { cc = 0; }
      const cutoffs = [0.5, 0.1, 0.05, 0.01, 0.001, 0.00001, -1];
      reaction.innerHTML = this.emojione(cutoffs.findIndex((val) => cc >= val));
    }
  }

  emojione(num) {
    const emojioneList = {
      ":scream:": ["1f631"],
      ":astonished:": ["1f632"],
      ":confused:": ["1f615"],
      ":rolling_eyes:": ["1f644"],
      ":relieved:": ["1f60c"],
      ":relaxed:": ["263a"],
      ":neutral_face:": ["1f610"],
      ":slight_smile:": ["1f642"],
      ":smiley:": ["1f603"],
      ":grinning:": ["1f600"],
    };

    const numToShort = {
      6: ":scream:",
      5: ":astonished:",
      4: ":confused:",
      3: ":rolling_eyes:",
      2: ":relieved:",
      1: ":relaxed:",
      0: ":smiley:",
    };

    const imagePathPNG = "http:\/\/cdn.jsdelivr.net\/emojione\/assets\/png\/";
    const imagePathSVG = "http:\/\/cdn.jsdelivr.net\/emojione\/assets\/svg\/";
    const cacheBustParam = "";
    const imageType = "png"; // png or svg

    const shortname = numToShort[num];
    const unicode = emojioneList[shortname][emojioneList[shortname].length - 1];
    const alt = shortname;

    let replaceWith = "";
    if (imageType === "png") {
      replaceWith = `<img class="emojione" alt="${alt}" src="${imagePathPNG}${unicode}.png" />`;
    } else {
      replaceWith = `<object class="emojione" data="${imagePathSVG}${unicode}.svg" type="image/svg+xml" standby="${alt}">${alt}</object`;
    }

    return replaceWith;
  }

  renderHistory(history) {
    const historyElem = document.getElementById(configs.historyElemId);
    historyElem.innerHTML = "";

    for (let i = history.length - 1; i >= 0; i--) {
      const elem = document.createElement("div");
      elem.innerHTML = `${i + 1}. ${history[i]}`;
      historyElem.appendChild(elem);
    }

    this.updateSteps(history.length);
  }

  setSteps(poss, max) {
    const currSteps = document.querySelectorAll(`.${configs.possStepsElemId}`);
    for (const currStep of currSteps) {
      currStep.innerHTML = poss;
    }

    const maxSteps = document.querySelectorAll(`.${configs.maxStepsElemId}`);
    for (const maxStep of maxSteps) {
      maxStep.innerHTML = max;
    }
  }

  updateSteps(steps) {
    const currSteps = document.querySelectorAll(`.${configs.currStepsElemId}`);
    for (const currStep of currSteps) {
      currStep.innerHTML = steps;
    }
  }
}

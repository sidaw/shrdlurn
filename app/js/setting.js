import configs from "./config";
import { getHistoryElems } from "./util";

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

  equalityCheck(struct1, struct2) {
    return struct1 == struct2;
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
      elem.setAttribute("data-type", history[i].type);
      elem.setAttribute("data-stepN", history[i].stepN);
      if (history[i].type === "accept") {
        elem.innerHTML = `${history[i].stepN}. ${history[i].query}`;
      } else {
        elem.innerHTML = history[i].query;
      }
      historyElem.appendChild(elem);
    }
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

  openDefineInterface(query, canAnswer, coverage) {
    if (query.length === 0) {
      this.status("nothing to define");
      return;
    }

    const defineInterface = document.getElementById("define_interface");
    defineInterface.classList.remove("hidden");

    document.getElementById(configs.consoleElemId).classList.add("hidden");
    document.getElementById("mainbuttons").classList.add("hidden");

    const defineStatus = document.getElementById("define_status");
    defineStatus.innerHTML = `Teach SHRDLURN ${query}.`;

    this.tryDefine(query, false, canAnswer, coverage);

    document.getElementById(configs.defineElemId).focus();
  }

  closeDefineInterface() {
    const defineInterface = document.getElementById("define_interface");
    defineInterface.classList.add("hidden");

    document.getElementById("define_phrase_button").innerHTML = "try";

    const consoleElem = document.getElementById(configs.consoleElemId);
    consoleElem.classList.remove("hidden");
    consoleElem.focus();
    document.getElementById("mainbuttons").classList.remove("hidden");
  }

  tryDefine(query, refineDefine, canAnswer, coverage = [], commandResponse = "") {
    const defineHeader = document.getElementById("define_header");

    if (!refineDefine) {
      if (canAnswer) {
        defineHeader.innerHTML = `Already understand ${query}, teach another meaning?`;
      } else {
        defineHeader.innerHTML = `Didn't understand "${this.intelHighlight(coverage)}". Please rephrase:`;
      }
    } else {
      if (canAnswer) {
        defineHeader.innerHTML = `SHRDLURN understands the definition, "${query}". If this is correct, click "define" to submit the definition.`;
      } else {
        defineHeader.innerHTML = `Still don't understand "${this.intelHighlight(coverage)}". Please rephrase:`;
      }

      // Special Statuses
      if (commandResponse.length > 0) {
        const defCore = commandResponse.indexOf("Core") !== -1;
        const defNoCover = status.indexOf("NoCover") !== -1;
        console.log(status);
        if (defCore) {
          // updateStatus("cannot redefine the core language!");
          defineHeader.innerHTML = `"${query}" is precisely understood, and cannot be redefined by "${this.intelHighlight(coverage)}".`;
        } else if (defNoCover) {
          // updateStatus("SHRDLRUN cannot learn from this definition");
          defineHeader.innerHTML = `Nothing (colors, numbers, etc) in "${this.intelHighlight(coverage)}" matches "${query}", so SHRDLURN cannot learn from this.`;
        }
      }
    }
  }

  intelHighlight(coverage) {
    let coloredQuery = "";
    for (let i = 0; i < coverage.length; i++) {
      const type = coverage[i][0];
      switch (type) {
        case "$ActionSeq":
          coloredQuery += "<span class='color-good'>";
          break;
        case "$Action":
          coloredQuery += "<span class='color-good'>";
          break;
        case "$CondSeq":
          coloredQuery += "<span class='color-good'>";
          break;
        case "$Cond":
          coloredQuery += "<span class='color-good'>";
          break;
        case "$NumberSeq":
          coloredQuery += "<span class='color-good'>";
          break;
        case "$Number":
          coloredQuery += "<span class='color-good'>";
          break;
        case "$Color":
          coloredQuery += "<span style='color:blue;'>";
          break;
        case "$Keyword":
          coloredQuery += "<span style='color:blue;'>";
          break;
        case "$UNK":
          coloredQuery += "<span style='color:red;'>";
          break;
        default:
          coloredQuery += "<span style='color:red;'>";
      }
      for (let j = 1; j < coverage[i].length; j++) {
        coloredQuery += `${coverage[i][j]} `;
      }
      coloredQuery += "</span>";
    }
    return coloredQuery;
  }

  revertHistory(index, game) {
    const newGame = game;

    const historyElems = getHistoryElems();
    console.log(historyElems);
    console.log(index);
    const state = newGame.history.find((h) => h.stepN === parseInt(historyElems[index].getAttribute("data-stepN"), 10));
    newGame.currentState = state.state;
    newGame.update();

    const newHistoryElems = getHistoryElems();
    newHistoryElems[index].classList.add("active");

    return newGame;
  }


}

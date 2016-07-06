import configs from "./config";
import { getHistoryElems, emojione } from "./util";

import Isomer,
       { Point,
         Shape,
         Color,
       } from "isomer";

/* eslint-disable new-cap */

export default class Setting {
  constructor() {
    this.iso = new Isomer(document.getElementById(configs.mainCanvas));
    this.isoTarget = new Isomer(document.getElementById(configs.targetCanvas));
    this.basicUnit = 0.8;
    this.width = 12;
    this.borderWidth = -0.15;
    this.baseHeight = 0.1;
    this.centerPoint = Point(this.width / 2, this.width / 2, this.width / 2);
    this.rotation = Math.PI / 12;
    this.targetScale = 0.5;
    this.targetTranslate = -2;

    this.renderCanvas(configs.emptyStruct);
    this.renderTarget(configs.emptyStruct);

    /* TODO: TEMPORARY FAKE DATA UNTIL SEMPRE IS UPDATED */
    const fake = [
      { x: 5, y: 3, z: 0, color: "Red", names: ["S", "A"] },
    ];

    const fakeTarget = [
      { x: 3, y: 2, z: 0, color: "Brown" },
    ];

    this.renderCanvas(fake);
    this.renderTarget(fakeTarget);
    /* END TODO */
  }

  renderTarget(state) {
    this.renderBoard(this.isoTarget, this.targetScale, this.targetTranslate);
    this.renderBlocks(this.isoTarget, state, this.targetScale, this.targetTranslate);
  }

  renderCanvas(state) {
    this.renderBoard(this.iso);
    this.renderBlocks(this.iso, state);
  }

  renderBoard(iso, scalingFactor = 1, translateFactor = 0) {
    const translateBy = translateFactor * this.basicUnit * scalingFactor;
    for (let x = this.width - 1; x >= 0; x--) {
      for (let y = this.width - 1; y >= 0; y--) {
        iso.add(
          Shape.Prism(
            Point((x + (this.borderWidth * x)) * scalingFactor,
                  (y + (this.borderWidth * y)) * scalingFactor,
                  0
                 ),
            this.basicUnit * scalingFactor,
            this.basicUnit * scalingFactor,
            this.baseHeight * scalingFactor
          )
          .rotateZ(this.centerPoint, this.rotation)
          .translate(translateBy, -translateBy, -4.5 * translateBy),
          new Color(144, 144, 144)
        );
      }
    }
  }

  renderBlocks(iso, state, scalingFactor = 1, translateFactor = 0) {
    const blocks = this.sortBlocks(state);
    for (const block of blocks) {
      const color = configs.colorMap[block.color];
      let blockColor = new Color();
      if (block.names && block.names.includes("_new")) {
        blockColor = new Color(color[0], color[1], color[2], 0.5);
      } else {
        blockColor = new Color(color[0], color[1], color[2]);
      }
      iso.add(this.makeBlock(block.x, block.y, block.z, scalingFactor, translateFactor), blockColor);
    }
  }

  makeBlock(x, y, z, scalingFactor = 1, translateFactor = 0) {
    const translateBy = translateFactor * this.basicUnit * scalingFactor;
    return Shape.Prism(
      Point((x + (x * this.borderWidth)) * scalingFactor,
            (y + (y * this.borderWidth)) * scalingFactor,
            (z + this.baseHeight + (this.borderWidth * z)) * scalingFactor
           ),
      this.basicUnit * scalingFactor, this.basicUnit * scalingFactor, this.basicUnit * scalingFactor
    )
    .rotateZ(this.centerPoint, this.rotation)
    .translate(translateBy, -translateBy, -4.5 * translateBy);
  }

  sortBlocks(blocks) {
    return blocks.sort((a, b) => {
      if (a.z > b.z) {
        return 1;
      } else if (a.z < b.z) {
        return -1;
      }

      if (a.x > b.x) {
        return -1;
      } else if (a.x < b.x) {
        return 1;
      }

      if (a.y > b.y) {
        return -1;
      } else if (a.y < b.y) {
        return 1;
      }

      return 0;
    });
  }

  equalityCheck(struct1, struct2) {
    return struct1 === struct2;
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
      reaction.innerHTML = emojione(3);
    } else {
      let cc = prob;
      if (!cc) { cc = 0; }
      const cutoffs = [0.5, 0.1, 0.05, 0.01, 0.001, 0.00001, -1];
      reaction.innerHTML = emojione(cutoffs.findIndex((val) => cc >= val));
    }
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
    const possSteps = document.querySelectorAll(`.${configs.possStepsElemId}`);
    for (const possStep of possSteps) {
      possStep.innerHTML = poss;
    }

    const maxSteps = document.querySelectorAll(`.${configs.maxStepsElemId}`);
    for (const maxStep of maxSteps) {
      maxStep.innerHTML = max;
    }
  }

  updateSteps(steps) {
    const currSteps = document.querySelectorAll(`.${configs.elems.currSteps}`);
    for (const currStep of currSteps) {
      currStep.innerHTML = steps;
    }
  }

  openDefineInterface(query, canAnswer, coverage) {
    if (query.length === 0) {
      this.status("nothing to define");
      return false;
    }

    const defineInterface = document.getElementById(configs.elems.defineInterface);
    defineInterface.classList.add("active");

    const defineStatus = document.getElementById(configs.elems.defineStatus);
    defineStatus.innerHTML = `Teach SHRDLURN ${query}.`;

    const toggleButton = document.getElementById(configs.buttons.toggleDefine);
    toggleButton.innerHTML = "Return";

    this.tryDefine(query, false, canAnswer, coverage);

    document.getElementById(configs.elems.defineConsole).focus();
    return true;
  }

  closeDefineInterface() {
    const defineInterface = document.getElementById(configs.elems.defineInterface);
    defineInterface.classList.remove("active");

    const toggleButton = document.getElementById(configs.buttons.toggleDefine);
    toggleButton.innerHTML = "Define";

    removePromptDefine();

    const consoleElem = document.getElementById(configs.elems.console);
    consoleElem.focus();
  }

  tryDefine(query, refineDefine, canAnswer, coverage = [], commandResponse = [], oldQuery = "") {
    const defineHeader = document.getElementById(configs.elems.defineHeader);
    document.getElementById(configs.definePromptElemId).classList.add("hidden");

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
        const defNoCover = commandResponse.indexOf("NoCover") !== -1;
        if (defCore) {
          // updateStatus("cannot redefine the core language!");
          defineHeader.innerHTML = `"${oldQuery}" is precisely understood, and cannot be redefined by "${this.intelHighlight(coverage)}".`;
        } else if (defNoCover) {
          // updateStatus("SHRDLRUN cannot learn from this definition");
          defineHeader.innerHTML = `Nothing (colors, numbers, etc) in "${this.intelHighlight(coverage)}" matches "${oldQuery}", so SHRDLURN cannot learn from this.`;
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
    const state = newGame.history.find((h) => h.stepN === parseInt(historyElems[index].getAttribute("data-stepN"), 10));
    newGame.currentState = state.state;
    newGame.update();

    const newHistoryElems = getHistoryElems();
    newHistoryElems[index].classList.add("active");

    return newGame;
  }

  promptDefine() {
    document.getElementById(configs.elems.definePrompt).classList.remove("hidden");
  }

  removePromptDefine() {
    document.getElementById(configs.elems.definePrompt).classList.add("hidden");
  }

  setSkips(skipsLeft) {
    const skipsLeftElem = document.getElementById("skips_left");
    if (skipsLeft !== 0) {
      skipsLeftElem.innerHTML = skipsLeft;
    } else {
      document.getElementById("skip_button").classList.add("hidden");
    }
  }

  toggleAccept() {
    document.getElementById(configs.elems.consoleGroup).classList.toggle("accepting");
  }
}

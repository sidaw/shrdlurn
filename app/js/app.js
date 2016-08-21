import "babel-polyfill";
import Awesomplete from "awesomplete";
import Game from "./game";
import configs from "./config";
import Setting from "./setting";
import Sempre from "./sempre";
import { getHistoryElems, resetStore, getStore, setStore } from "./util";

class App {
  constructor() {
    this.Sempre = new Sempre();
    this.Setting = new Setting();
    this.Game = new Game(this.Setting, this.Sempre);
    this.consoleElem = document.getElementById(configs.consoleElemId);
    this.defineElem = document.getElementById(configs.defineElemId);
    this.defineState = false;
    this.activeHistoryElem = -1;
    this.awesomplete = {};
    this.helpOn = false;
    this.keyboardOn = false;
    this.structuresOn = false;
    this.watchOutForDefine = false;
    this.submitOn = false;

    this.tutorial = !getStore("completed_tutorial", false);
    this.tutorialStep = 1;

    this.updateRandomUtterances();

    // this.generateTarget();
    this.setupAutocomplete();

    this.consoleElem.focus();
  }

  generateTarget() {
    /* Generate Target at Random */
    this.Game.setTarget(this.Game.getRandomTarget());
  }

  enter() {
    if (this.submitOn) {
      this.submitStruct();
      return;
    }

    if (this.tutorial && this.tutorialStep === 4) {
      this.Setting.promptDefine();
      this.Game.resetResponses();
      this.Game.taggedCover = [["$Action", "add"], ["$Number", "3"], ["$Color", "red"], ["$UNK", "on", "top", "of", "green"]];
      this.Game.query = "add 3 red on top of green";
      this.Setting.status("SHRDLURN did not understand (click define to define this)", this.Game.query);
      return;
    }

    if (this.defineState) {
      if (this.defineElem.value.length === 0) return;

      if (this.tutorial && this.tutorialStep === 5) {
        this.Game.defineSuccess = this.defineElem.value;
        this.Game.selectedResp = 0;
        this.Game.responses = [{ "value": [{ "x": 3, "y": 4, "z": 3, "color": "Red", "names": [] }, { "x": 3, "y": 4, "z": 0, "color": "Green", "names": [] }, { "x": 3, "y": 3, "z": 0, "color": "Red", "names": ["S"] }, { "x": 3, "y": 4, "z": 2, "color": "Red", "names": [] }, { "x": 3, "y": 4, "z": 1, "color": "Red", "names": [] }], "formula": "(:for (color green) (:loop (number 3) (: add red top)))", "formulas": ["(:for (color green) (:loop (number 3) (: add red top)))"], "prob": null, "probs": ["NaN"], "pprob": null, "pprobs": [null], "score": 1.0824721, "rank": 0, "count": 1, "maxprob": null, "maxpprob": null }];
        this.Game.update();
        this.Setting.tryDefine(this.Game.defineSuccess, true, true);
        this.Setting.toggleDefineButton();
        document.querySelector("#define_interface .input-group").classList.add("accepting");
        this.pastDefine = this.defineElem.value;
        return;
      }

      // TODO: Validate define length!

      let defined = "";
      if (this.tutorial && this.tutorialStep === 6) {
        defined = "add 3 red on top of green";
      } else {
        defined = this.Game.define(this.defineElem.value);
      }

      if (defined) {
        this.defineState = false;
        this.defineElem.value = "";
        this.Setting.closeDefineInterface();
        this.consoleElem.value = defined;
        this.consoleElem.focus();
        this.pastDefine = "";
        this.Setting.removeAccept();
      } else {
        this.pastDefine = this.defineElem.value;
      }

      this.watchOutForDefine = true;
      return;
    }

    if (this.consoleElem.value.length === 0) return;

    if (this.activeHistoryElem > 0) {
      const historyElems = getHistoryElems();
      this.Game.history = this.Game.history.slice(0, historyElems.length - this.activeHistoryElem);
      this.activeHistoryElem = -1;
    }

    this.Game.enter(this.consoleElem.value);

    this.updateRandomUtterances();
  }

  accept() {
    this.Game.accept();
    this.consoleElem.value = "";
    this.consoleElem.focus();
    this.updateRandomUtterances();
  }

  clear() {
    this.Game.clear();
    this.consoleElem.focus();
    this.updateRandomUtterances();
    this.Game.Logger.log({ type: "clear", msg: "" });
  }

  next() {
    this.Game.next();
  }

  prev() {
    this.Game.prev();
  }

  openDefineInterface() {
    if (this.Setting.openDefineInterface(this.Game.query, this.Game.responses.length > 0, this.Game.taggedCover)) {
      this.defineState = true;
    }
  }

  closeDefineInterface() {
    this.Setting.closeDefineInterface();
    this.Game.defineSuccess = "";
    this.defineState = false;
  }

  toggleDefineInterface() {
    if (this.defineState) {
      this.closeDefineInterface();
    } else {
      this.openDefineInterface();
    }
  }

  undo() {
    const historyElems = getHistoryElems();
    if (this.activeHistoryElem === historyElems.length - 1) {
      return;
    } else if (this.activeHistoryElem >= 0) {
      this.revert(this.activeHistoryElem + 1);
    } else if (historyElems.length > 1) {
      this.revert(1);
    }
  }

  redo() {
    if (this.activeHistoryElem === 0) {
      return;
    } else if (this.activeHistoryElem > 0) {
      this.revert(this.activeHistoryElem - 1);
    }
  }

  revert(index) {
    this.Game = this.Setting.revertHistory(index, this.Game);
    this.activeHistoryElem = index;
    this.Game.Logger.log({ type: "revert", msg: { index } });
  }

  setupAutocomplete() {
    this.defineElem.addEventListener("input", this.onautocomplete.bind(this), false);
    this.defineElem.addEventListener("focus", this.onautocomplete.bind(this), false);

    this.awesomplete = new Awesomplete(this.defineElem,
      { minChars: 0,
        list: ["remove if top red", "add yellow",
         "add brown if has red or row = 3",
         "add yellow if row = 3",
         "repeat add yellow 3 times"],
        filter() { return true; },
      });
  }

  onautocomplete(e) {
    if (this.defineElem.value.endsWith(" ")) {
      this.autocomplete(this.defineElem.value);
    } else if (this.defineElem.value.length === 0) {
      this.autocomplete("");
    }
    e.stopPropagation();
  }

  autocomplete(prefix) {
    const cmdautocomp = `(autocomplete "${prefix}")`;
    const cmds = { q: cmdautocomp, sessionId: this.Game.sessionId };

    this.Sempre.query(cmds, (response) => {
      const autocomps = response.autocompletes;
      this.awesomplete.list = autocomps;
      this.awesomplete.open();
      this.awesomplete.evaluate();
    });
  }

  skip() {
    this.Game.skipTarget();
    this.updateRandomUtterances();
  }

  updateRandomUtterances() {
    this.Sempre.query({ q: "(autocomplete \"\")", sessionId: this.Game.sessionId }, (resp) => {
      const autocompletes = resp.autocompletes;
      // let randomStrings = "";
      // for (const ac of autocompletes) {
      //   randomStrings += `<span>${ac}</span><br>`;
      // }
      const randomStrings = `<span>${autocompletes[0]}</span>`;
      document.getElementById(configs.randomElemId).innerHTML = randomStrings;
    });
  }

  resetAllProgress() {
    resetStore();
    window.location.reload();
  }

  toggleHelp() {
    if (!this.helpOn) {
      this.Sempre.query({ q: "(autocomplete \"\")", sessionId: this.Game.sessionId }, (resp) => {
        const autocompletes = resp.autocompletes;
        let randomStrings = "";
        for (const ac of autocompletes) {
          randomStrings += `<span>${ac}</span><br>`;
        }
        document.getElementById("help_examples").innerHTML = randomStrings;
      });
    }

    this.helpOn = !this.helpOn;
    document.getElementById(configs.elems.helpMe).classList.toggle("active");
  }

  toggleKeyboard() {
    this.keyboardOn = !this.keyboardOn;
    document.getElementById(configs.elems.keyboard).classList.toggle("active");
  }

  toggleStructures() {
    console.log("structuring...");
    if (!this.structuresOn) {
      /* Get the structs */
      console.log("get the structs");
      fetch(`${configs.structsServer}/structs`)
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          const structs = json.structs;
          const structsList = document.getElementById("user_structs");
          structsList.innerHTML = "";
          for (let i = 0; i < structs.length; i++) {
            const state = structs[i].state.map((c) => (
              {
                x: c[0],
                y: c[1],
                z: c[2],
                color: c[3],
                names: c[4],
              }
            ));

            const elem = document.createElement("li");
            elem.setAttribute("data-state", JSON.stringify(state));
            elem.setAttribute("data-nsteps", structs[i].nsteps);

            /* Hide recipe steps for turkers */
            let recipeSteps = [];
            if (!(process.env.NODE_ENV === "turk" || process.env.NODE_ENV === "turkproduction")) {
              recipeSteps = structs[i].history.map((h) => h.query);
            }
            elem.innerHTML = `<canvas id='usercanvas${i}' class='usercanvas' width='600px' height='600px'></canvas><div class='structs-meta'>${structs[i].name}<p class='structs-meta-history'>${recipeSteps.join("; ")}</p></div>`;
            structsList.appendChild(elem);
            elem.addEventListener("click", (e) => {
              const target = e.target.parentNode;
              this.Game.setTarget([-1, JSON.parse(target.getAttribute("data-nsteps")), JSON.parse(target.getAttribute("data-state"))]);
              this.Game.currentState =
              this.toggleStructures();
            });
            this.Setting.renderUserCanvas(state, `usercanvas${i}`);
          }
        });
    }

    this.structuresOn = !this.structuresOn;
    document.getElementById(configs.elems.structures).classList.toggle("active");
  }

  putBack() {
    this.Setting.removeAccept();
    this.Setting.removePromptDefine();
    this.Game.resetResponses();
    this.Game.update();
    this.consoleElem.value = "";
    this.consoleElem.focus();
  }

  defining() {
    if (this.watchOutForDefine) {
      this.Setting.toggleDefineButton();
      this.watchOutForDefine = false;
    }
    this.Setting.promptTryDefine();
  }

  rotate(el) {
    const rotateIcons = document.querySelectorAll(`.${configs.buttons.rotateIcons} > div`);
    for (const rotateIcon of rotateIcons) {
      rotateIcon.classList.remove("active");
    }
    el.classList.add("active");
    this.Setting.rotate(el.getAttribute("data-rotate"));
    this.Game.update();
    this.Game.updateTarget();
  }

  openSubmit() {
    const submitInterface = document.getElementById(configs.elems.submitInterface);
    submitInterface.classList.add("active");
    document.getElementById(configs.elems.submitConsole).focus();
    this.submitOn = true;
  }

  closeSubmit() {
    const submitInterface = document.getElementById(configs.elems.submitInterface);
    submitInterface.classList.remove("active");
    document.getElementById(configs.elems.console).focus();
    this.submitOn = false;
  }

  submitStruct() {
    const name = document.getElementById(configs.elems.submitConsole).value;
    const { sessionId, currentState, history } = this.Game;
    const state = currentState.map(c => ([c.x, c.y, c.z, c.color, c.names]));
    // const formulas = history.map(h => (h.formula));
    const cmds = { q: `(submit "${name}" "${JSON.stringify(state)}")`, sessionId };

    this.Sempre.query(cmds, () => {
      this.Game.Logger.log({ type: "submit", msg: { name, state } });
      fetch(`${configs.structsServer}/structs/submit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          state,
          nsteps: this.Game.getSteps(),
          history,
        }),
      });

      alert("Submitted your structure!");
      this.closeSubmit();
    });
  }

  start() {
    document.getElementById(configs.elems.welcome).classList.remove("active");
    if (this.tutorial) this.openTutorial();
  }

  openTutorial() {
    document.getElementById("tutorial-1").classList.add("active");
    this.Game.Logger.log({ type: "tutorial", msg: "start" });
  }

  nextTutorial() {
    document.getElementById(`tutorial-${this.tutorialStep}`).classList.remove("active");
    this.tutorialStep++;
    const nextTutorial = document.getElementById(`tutorial-${this.tutorialStep}`);
    if (nextTutorial) {
      nextTutorial.classList.add("active");
    } else {
      this.endTutorial();
      this.clear();
    }
  }

  endTutorial() {
    setStore("completed_tutorial", true);
    this.tutorial = false;
    this.Game.Logger.log({ type: "tutorial", msg: "end" });
  }

  restartTutorial() {
    this.tutorial = true;
    setStore("completed_tutorial", false);
    this.tutorialStep = 1;
    this.openTutorial();
  }

  prevTutorial() {
    document.getElementById(`tutorial-${this.tutorialStep}`).classList.remove("active");
    this.tutorialStep--;
    document.getElementById(`tutorial-${this.tutorialStep}`).classList.add("active");
  }

  skipTutorial() {
    document.getElementById(`tutorial-${this.tutorialStep}`).classList.remove("active");
    this.endTutorial();
  }

  monitorConsole() {
    if (this.Setting.accepting() && this.consoleElem.value !== this.Game.query) this.Setting.removeAccept();
  }

  monitorDefine() {
    if (this.Setting.defineAccepting() && this.defineElem.value !== this.pastDefine) this.Setting.removeDefineAccept();
  }
}

const A = new App();

/* Event Listeners */

document.getElementById(configs.buttons.do).addEventListener("click", () => A.enter(), false);
document.getElementById(configs.buttons.accept).addEventListener("click", () => A.accept(), false);
document.getElementById(configs.buttons.prev).addEventListener("click", () => A.prev(), false);
document.getElementById(configs.buttons.next).addEventListener("click", () => A.next(), false);
document.getElementById(configs.buttons.clear).addEventListener("click", () => A.clear(), false);
document.getElementById(configs.buttons.toggleDefine).addEventListener("click", () => A.toggleDefineInterface(), false);
document.getElementById(configs.consoleElemId).addEventListener("keyup", () => true);
document.getElementById(configs.buttons.define).addEventListener("click", () => A.enter(), false);
document.getElementById(configs.buttons.tryDefine).addEventListener("click", () => { A.Game.defineSuccess = ""; A.enter(); }, false);
document.getElementById(configs.buttons.skip).addEventListener("click", () => A.skip(), false);
document.getElementById(configs.buttons.putBack).addEventListener("click", () => A.putBack(), false);
document.getElementById(configs.elems.defineConsole).addEventListener("keydown", (e) => A.defining(e), false);
document.getElementById(configs.buttons.closeDefine).addEventListener("click", () => A.closeDefineInterface());
document.getElementById(configs.buttons.submitButton).addEventListener("click", () => A.openSubmit());
document.getElementById(configs.buttons.closeSubmit).addEventListener("click", () => A.closeSubmit());
document.getElementById(configs.buttons.submitStructure).addEventListener("click", () => A.submitStruct());
document.getElementById(configs.buttons.start).addEventListener("click", () => A.start());
document.getElementById(configs.buttons.restartTutorial).addEventListener("click", () => A.restartTutorial());
document.getElementById(configs.consoleElemId).addEventListener("keyup", () => A.monitorConsole());
document.getElementById(configs.defineElemId).addEventListener("keyup", () => A.monitorDefine());

for (const dT of document.getElementsByClassName(configs.buttons.define_instead)) {
  dT.addEventListener("click", (e) => { e.preventDefault(); A.openDefineInterface(); });
}

for (const nT of document.getElementsByClassName("next-tutorial")) {
  nT.addEventListener("click", () => A.nextTutorial());
}

for (const nT of document.getElementsByClassName("prev-tutorial")) {
  nT.addEventListener("click", () => A.prevTutorial());
}

for (const nT of document.getElementsByClassName("skip-tutorial")) {
  nT.addEventListener("click", (e) => { e.preventDefault(); A.skipTutorial(); });
}

function openAndCloseSetter(selector, callback, callbackObj) {
  const buttons = document.querySelectorAll(selector);
  for (const button of buttons) {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      callback.apply(callbackObj);
    });
  }
}

openAndCloseSetter(".help-toggle", A.toggleHelp, A);
openAndCloseSetter(".keyboard-toggle", A.toggleKeyboard, A);
openAndCloseSetter(".structures-toggle", A.toggleStructures, A);

document.getElementById("command_history").addEventListener("click", (e) => {
  let index = 0;
  const type = e.target.getAttribute("data-type");
  if (!(type === "accept" || type === "initial")) { return; }
  index = getHistoryElems().length - parseInt(e.target.getAttribute("data-stepN"), 10) - 1;
  A.revert(index);
}, false);

const rotateIcons = document.querySelectorAll(`.${configs.buttons.rotateIcons} > div`);
for (const rotateIcon of rotateIcons) {
  rotateIcon.addEventListener("click", (e) => A.rotate(e.target), false);
}

/* Keyboard shortcuts */

const Hotkeys = {
  ENTER: "13",
  LEFT: "37",
  RIGHT: "39",
  UP: "38",
  DOWN: "40",
  UNDO: "90+ctrl",
  REDO: "90+shift+ctrl",
  TEACH: "68+ctrl",
  ESC: "27",
  SHIFTENTER: "13+shift",
};

window.onkeydown = (e) => {
  let key = "";
  key += e.keyCode;

  if (e.shiftKey) { key += "+shift"; }
  if (e.ctrlKey || e.metaKey) { key += "+ctrl"; }

  switch (key) {
    case Hotkeys.UP:
      e.preventDefault();
      A.prev();
      break;
    case Hotkeys.DOWN:
      e.preventDefault();
      A.next();
      break;
    case Hotkeys.SHIFTENTER:
      e.preventDefault();
      if (A.defineState) { A.enter(); break; }
      A.accept();
      break;
    case Hotkeys.ENTER:
      e.preventDefault();
      if (A.Setting.accepting() && !A.defineState) { A.accept(); break; }
      if (A.Setting.defineAccepting()) { A.enter(); break; }
      A.enter();
      break;
    case Hotkeys.TEACH:
      e.preventDefault();
      A.openDefineInterface();
      break;
    case Hotkeys.ESC:
      if (A.helpOn) {
        A.toggleHelp();
      } else if (A.keyboardOn) {
        A.toggleKeyboard();
      } else if (A.structuresOn) {
        A.toggleStructures();
      } else if (A.submitOn) {
        A.toggleStructures();
      } else if (A.defineState) {
        A.closeDefineInterface();
      }
      break;
    case Hotkeys.UNDO:
      e.preventDefault();
      A.undo();
      break;
    case Hotkeys.REDO:
      e.preventDefault();
      A.redo();
      break;
    default:
  }
};

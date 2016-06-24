import Game from "./game";
import configs from "./config"

class App {
  constructor() {
    this.Game = new Game();
    this.consoleElem = document.getElementById(configs.consoleElemId);

    /* Generate Target at Random */
    this.Game.setTarget(this.getRandomTarget());
  }

  enter() {
    this.Game.enter(this.consoleElem.value);
    this.consoleElem.value = "";
  }

  accept() {
    this.Game.accept();
    this.consoleElem.focus();
  }

  clear() {
    this.Game.clear();
    this.consoleElem.focus();
  }

  next() {
    this.Game.next();
  }

  prev() {
    this.Game.prev();
  }

  getRandomTarget() {
    return configs.targets[Math.floor(Math.random() * configs.targets.length)];
  }
}

const A = new App();

/* Event Listeners */

document.getElementById("dobutton").addEventListener("click", () => A.enter(), false);
document.getElementById("flyingaccept").addEventListener("click", () => A.accept(), false);
document.getElementById("prevbutton").addEventListener("click", () => A.prev(), false);
document.getElementById("nextbutton").addEventListener("click", () => A.next(), false);
document.getElementById("clear_button").addEventListener("click", () => A.clear(), false);

/* Keyboard shortcuts */


const Hotkeys = {
  ENTER: "13",
  LEFT: "37",
  RIGHT: "39",
  UP: "38",
  DOWN: "40",
  Z: "90",
  D: "68",
  ESC: "27",
  SHIFTENTER: "13+shift",
};

window.onkeyup = (e) => {
  let key = "";
  key += e.keyCode;

  if (e.shiftKey) {
    key += "+shift";
  } else if (e.ctrlKey) {
    key += "+ctrl";
  }

  switch (key) {
    case Hotkeys.UP:
      A.prev();
      break;
    case Hotkeys.DOWN:
      A.next();
      break;
    case Hotkeys.SHIFTENTER:
      A.accept();
      break;
    case Hotkeys.ENTER:
      A.enter();
      break;
    default:
  }
};

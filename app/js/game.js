import configs from "./config";
import Logger from "./logger";
import { getStore, setStore } from "./util";
import { getTurkId, getTurkCode } from "./turk";

export default class Game {
  constructor(setting, sempreClient) {
    this.sessionId = configs.defaultSessionId;

    this.currentState = configs.defaultStruct;
    this.responses = [];
    this.selectedResp = -1;
    this.query = "";
    this.history = this.initialHistory();
    this.taggedCover = "";
    this.defineSuccess = "";

    this.targetStruct = configs.defaultStruct;
    this.targetIdx = -1;
    this.maxTargetSteps = 0;
    this.skipsLeft = configs.defaultSkips;

    this.Sempre = sempreClient;

    this.Setting = setting;
    this.Setting.renderHistory(this.history);

    this.Logger = new Logger(this.sessionId);
    this.Logger.log({ type: "start", msg: [this.currentState] });

    /* For turking purposes */
    if (process.env.NODE_ENV === "turk" || process.env.NODE_ENV === "turkproduction") {
      this.sessionId = getTurkId();
    }
  }

  setTarget(targetStruct) {
    this.targetIdx = targetStruct[0];
    this.targetStruct = targetStruct[2];
    this.maxTargetSteps = targetStruct[1] * configs.difficulty;

    this.Setting.renderTarget(this.targetStruct);
    this.Setting.setSteps(targetStruct[1], this.maxTargetSteps);

    this.Logger.log({ type: "target", msg: [JSON.stringify(this.targetStruct)] });
  }

  updateTarget() {
    this.Setting.renderTarget(this.targetStruct);
  }

  enter(query) {
    if (query.length === 0) this.Setting.status("enter a command");
    // TODO: Validate length!
    this.querySempre(query);
  }

  querySempre(querystr) {
    const query = this.Sempre.formatQuery(querystr);
    var contextCommand = "(context)";
    if (this.currentState) {
      const currentState = JSON.stringify(JSON.stringify(this.currentState.map(c => ([c.x, c.y, c.z, c.color, c.names]))));
      contextCommand = `(context (graph NaiveKnowledgeGraph ((string ${currentState}) (name b) (name c))))`;
    }

    const contextCmds = { q: contextCommand, sessionId: this.sessionId };

    this.Sempre.query(contextCmds, () => {
      const cmds = { q: query, sessionId: this.sessionId };
      this.Sempre.query(cmds, (response) => {
        this.taggedCover = response.taggedcover;

        const formval = this.Sempre.parseSEMPRE(response.candidates);
        if (formval === null || formval === undefined) {
          console.log("no answer from sempre");
          this.resetResponses();
          this.query = query;
          this.Setting.status("SHRDLURN did not understand", query);
          this.Setting.promptDefine();
          this.Logger.log({ type: "queryUnknown", msg: [query] });
          this.Setting.promptAccept();
        } else {
          this.Setting.removePromptDefine();
          this.responses = formval;
          this.selectedResp = 0;
          this.query = query;
          this.Setting.status(`got ${this.responses.length} options, use &darr; and &uarr; to scroll, and accept to confirm.`, `${query} (#1/${this.responses.length})`, this.responses[0].maxprop | -1);
          this.Logger.log({ type: "query", msg: [query] });
          this.Setting.promptAccept();
        }

        if (configs.debugMode) {
          console.log(response);
        }

        this.update();
      });
    });
  }

  accept() {
    if (this.getSteps() >= this.maxTargetSteps) {
      this.Setting.status("you've reached the maxinum number of steps", "can't accept");
      this.Logger.log({ type: "meta", msg: ["max steps"] });
      this.Setting.removeAccept();
    } else if (this.responses.length > 0) {
      this.Sempre.query({ q: this.query, accept: this.responses[this.selectedResp].rank, sessionId: this.sessionId }, () => {});

      this.currentState = this.responses[this.selectedResp].value;
      this.Setting.status(`✓: accepted, enter another command`);
      this.Logger.log({ type: "accept", msg: [this.query, JSON.stringify(this.currentState), JSON.stringify(this.responses[this.selectedResp].formula)] });
      this.history.push({ query: this.query, type: "accept", state: this.currentState, stepN: this.getSteps() + 1, formula: this.responses[this.selectedResp].formula });
      this.resetResponses();
      this.update();
      this.Setting.removeAccept();
    } else {
      this.Setting.status("✓: can't accept nothing, say something first");
    }

    if (this.Setting.equalityCheck(this.currentState, this.targetStruct)) {
      this.win();
    }
  }

  win() {
    const usedTargets = getStore("usedTargetsv1", []);
    usedTargets.push(this.targetIdx);
    setStore("usedTargetsv1", usedTargets);
    this.Logger.log({ type: "win", msg: [this.targetIdx, this.getSteps(), JSON.stringify(this.history.map(h => ([h.query, h.formula])))] });

    if (process.env.NODE_ENV === "turk" || process.env.NODE_ENV === "turkproduction") {
      const turkcode = getTurkCode(`v1,${this.targetIdx}`, this.getSteps(), this.currentState);
      alert(`Congratulations! You have successfully completed the task. Please copy this confirmation code and submit it to complete the hit: ${turkcode}`);
    } else {
      alert("You've did it! Congratulations! You've made the target! Try another one now.");
    }

    this.setTarget(this.getRandomTarget());
    this.clear();
  }

  resetResponses() {
    this.selectedResp = -1;
    this.responses = [];
    this.query = "";
  }

  update() {
    /* Update the canvas */
    let afterStruct = this.currentState;
    if (this.responses.length > 0) {
      afterStruct = this.Setting.computeDiff(this.currentState, this.responses[this.selectedResp].value);
    }
    this.Setting.renderCanvas(afterStruct);

    /* Update the history */
    this.Setting.renderHistory(this.history);
    this.Setting.updateSteps(this.getSteps());
  }

  define(query) {
    /* If just trying, update the current structure and everything */
    if (this.defineSuccess.length === 0 || query !== this.defineSuccess) {
      const cmds = { q: `(uttdef "${this.Sempre.formatQuery(query)}" -1)`, sessionId: this.sessionId };

      this.Logger.log({ type: "trydefine", msg: [query] });

      this.Sempre.query(cmds, (response) => {
        const formval = this.Sempre.parseSEMPRE(response.candidates);
        const commandResponse = response.commandResponse;

        const defCore = commandResponse.indexOf("Core") !== -1;
        const defNoCover = commandResponse.indexOf("NoCover") !== -1;
        const defNoParse = commandResponse.indexOf("NoParse") !== -1;

        if (defCore || defNoCover || defNoParse) {
          this.taggedCover = response.taggedcover;
          this.Setting.tryDefine(query, true, false, this.taggedCover, commandResponse, this.query);
        } else {
          this.defineSuccess = query;
          this.selectedResp = 0;
          this.responses = formval;
          this.update();
          this.Setting.tryDefine(query, true, true);
          this.Setting.toggleDefineButton();
        }
      });
      return false;
    }

    /* Otherwise, submit the definition if already tried */
    const text = `(uttdef "${this.Sempre.formatQuery(this.defineSuccess)}" ${this.responses[this.selectedResp].rank})`;
    const cmds = { q: text, sessionId: this.sessionId };
    const newPhrase = this.query;

    this.Sempre.query(cmds, (resp) => {
      this.history.push({ query: `defined "${this.query}" as "${this.defineSuccess}"`, type: "define" });
      this.Logger.log({ type: "define", msg: [this.query, this.defineSuccess, JSON.stringify(resp.candidates[0].formula)] });
      this.defineSuccess = "";
      this.resetResponses();
      this.update();
      this.Setting.status("definition accepted. thanks for teaching!");
    });

    return newPhrase;
  }

  clear() {
    this.Logger.log({ type: "clear", msg: [""] });
    this.resetResponses();
    this.history = this.initialHistory();
    this.currentState = configs.emptyStruct;
    this.update();
    this.Setting.status("cleared the space");
  }

  next() {
    if (this.responses.length <= 0) {
      this.Setting.status("↓: can't scroll, say something or ⎌");
    } else if (this.selectedResp !== this.responses.length - 1) {
      this.selectedResp++;
      this.update();
      this.Setting.status("↓: showing the next one", `${this.query} (#${this.selectedResp + 1}/${this.responses.length})`, this.responses[0].maxprop | -1);
      this.Logger.log({ type: "scroll", msg: ["next"] });
    } else {
      this.Setting.status("↓: already showing the last one", `${this.query} (#${this.selectedResp + 1}/${this.responses.length})`, this.responses[0].maxprop | -1);
    }
  }

  prev() {
    if (this.responses.length <= 0) {
      this.Setting.status("↑: can't scroll, say something or ⎌");
    } else if (this.selectedResp !== 0) {
      this.selectedResp--;
      this.update();
      this.Setting.status("↑: showing the previous one", `${this.query} (#${this.selectedResp + 1}/${this.responses.length})`, this.responses[0].maxprop | -1);
      this.Logger.log({ type: "scroll", msg: ["prev"] });
    } else {
      this.Setting.status("↑: already showing the first one", `${this.query} (#${this.selectedResp + 1}/${this.responses.length})`, this.responses[0].maxprop | -1);
    }
  }

  getSteps() {
    return this.history.filter((h) => h.type === "accept").length;
  }

  initialHistory() {
    return [{ type: "initial", query: "initial", state: configs.defaultStruct, stepN: 0, formula: "" }];
  }

  getRandomTarget() {
    const usedTargets = getStore("usedTargetsv1", []);
    if (usedTargets.length === configs.targets.length) {
      alert("You've completed all targets! Resetting...");
      setStore("usedTargetsv1", []);
    }

    let targetIdx = -1;
    do {
      targetIdx = Math.floor(Math.random() * configs.targets.length);
    } while (usedTargets.includes(targetIdx));

    return [targetIdx, ...configs.targets[targetIdx]];
  }

  skipTarget() {
    this.skipsLeft--;
    this.Setting.setSkips(this.skipsLeft);
    const usedTargets = getStore("usedTargetsv1", []);
    if (configs.targets.length - usedTargets.length > 1) {
      let randomTarget = [];
      do {
        randomTarget = this.getRandomTarget();
      } while (randomTarget[0] === this.targetIdx);
      this.Logger.log({ type: "skip", msg: [JSON.stringify(this.targetStruct[1])] });
      this.setTarget(randomTarget);
    } else {
      alert("Sorry, this is the last target. No skips possible.");
    }
  }
}

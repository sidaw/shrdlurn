import Setting from "./setting";
import SempreClient from "./sempre";
import configs from "./config";

export default class Game {
  constructor() {
    this.sessionId = configs.defaultSessionId;

    this.currentState = configs.defaultStruct;
    this.responses = [];
    this.selectedResp = -1;
    this.query = "";
    this.history = this.initialHistory();
    this.taggedCover = "";
    this.defineSuccess = "";

    this.targetStruct = configs.defaultStruct;
    this.maxTargetSteps = 0;

    this.Sempre = new SempreClient();

    this.Setting = new Setting();
    this.Setting.renderHistory(this.history);
  }

  setTarget(targetStruct) {
    this.targetStruct = targetStruct[1];
    this.maxTargetSteps = targetStruct[0] * configs.difficulty;

    this.Setting.renderTarget(this.targetStruct);
    this.Setting.setSteps(targetStruct[0], this.maxTargetSteps);
  }

  enter(query) {
    if (query.length === 0) this.Setting.status("enter a command");
    // TODO: Validate length!
    this.querySempre(query);
  }

  querySempre(querystr) {
    const query = this.Sempre.formatQuery(querystr);

    const contextCommand = `(context (graph NaiveKnowledgeGraph ((string ${this.currentState}) (name b) (name c))))`;
    const contextCmds = { q: contextCommand, sessionId: this.sessionId };

    this.Sempre.query(contextCmds, () => {
      const cmds = { q: query, sessionId: this.sessionId };
      this.Sempre.query(cmds, (response) => {
        this.taggedCover = response.taggedcover;

        const formval = this.Sempre.parseSEMPRE(response.candidates);
        if (formval == null) {
          console.log("no answer from sempre");
          this.resetResponses();
          this.query = query;
          this.Setting.status('SHRDLURN did not understand', query);
        } else {
          this.responses = formval;
          this.selectedResp = 0;
          this.query = query;
          this.Setting.status(`got ${this.responses.length} options, use &darr; and &uarr; to scroll, and ✓ to confirm.`, `${query} (#1/${this.responses.length})`, this.responses[0].maxprop | -1);
        }

        if (configs.debugMode) {
          console.log(response);
        }

        this.update();
      });

      // TODO: Update random utterances
    });
  }

  accept() {
    if (this.getSteps() >= this.maxTargetSteps) {
      this.Setting.status("you've reached the maxinum number of steps", "can't accept");
    } else if (this.responses.length > 0) {
      this.Sempre.query({ q: this.query, accept: this.responses[this.selectedResp].rank, sessionId: this.sessionId }, () => {});

      this.currentState = this.responses[this.selectedResp].value;
      this.Setting.status(`✓: accepted, enter another command`);
      this.history.push({ query: this.query, type: "accept", state: this.currentState, stepN: this.getSteps() + 1 });
      this.resetResponses();
      this.update();
    } else {
      this.Setting.status("✓: can't accept nothing, say something first");
    }

    if (this.Setting.equalityCheck(this.currentState, this.targetStruct)) {
      alert("You've did it! Congratulations! You've made the target! Try another one now.");
      this.setTarget(this.getRandomTarget());
      this.clear();
    }
  }

  resetResponses() {
    this.selectedResp = -1;
    this.responses = [];
    this.query = "";
  }

  update() {
    /* Update the canvas */
    let afterStruct = configs.emptyStruct;
    if (this.responses.length > 0) afterStruct = this.responses[this.selectedResp].value;
    this.Setting.renderCanvas([this.currentState, afterStruct]);

    /* Update the history */
    this.Setting.renderHistory(this.history);
    this.Setting.updateSteps(this.getSteps());
  }

  define(query) {
    /* If just trying, update the current structure and everything */
    if (this.defineSuccess.length === 0 || query !== this.defineSuccess) {
      const cmds = { q: `(uttdef "${this.Sempre.formatQuery(query)}" -1)`, sessionId: this.sessionId };
      this.Sempre.query(cmds, (response) => {
        const formval = this.Sempre.parseSEMPRE(response.candidates);
        const commandResponse = response.commandResponse;

        const defCore = commandResponse.indexOf("Core") !== -1;
        const defNoCover = commandResponse.indexOf("NoCover") !== -1;
        const defNoParse = commandResponse.indexOf("NoParse") !== -1;

        if (defCore || defNoCover || defNoParse) {
          this.taggedCover = response.taggedcover;
          this.Setting.tryDefine(query, true, false, this.taggedCover, commandResponse);
        } else {
          this.defineSuccess = query;
          this.selectedResp = 0;
          this.responses = formval;
          this.update();
          this.Setting.tryDefine(query, true, true);
          document.getElementById(configs.defineButton).innerHTML = "define";
        }
      });
      return false;
    }

    /* Otherwise, submit the definition if already tried */
    const text = `(uttdef "${this.Sempre.formatQuery(this.defineSuccess)}" ${this.responses[this.selectedResp].rank})`;
    const cmds = { q: text, sessionId: this.sessionId };

    this.Sempre.query(cmds, () => {
      this.history.push({ query: `defined "${this.query}" as "${this.defineSuccess}"`, type: "define" });
      this.defineSuccess = "";
      this.resetResponses();
      this.update();
      this.Setting.status("definition accepted. thanks for teaching!");
    });

    const newPhrase = this.defineSuccess;
    return newPhrase;
  }

  clear() {
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
    } else {
      this.Setting.status("↑: already showing the first one", `${this.query} (#${this.selectedResp + 1}/${this.responses.length})`, this.responses[0].maxprop | -1);
    }
  }

  getSteps() {
    return this.history.filter((h) => h.type === "accept").length;
  }

  initialHistory() {
    return [{ type: "initial", query: "intial", state: configs.defaultStruct, stepN: 0 }];
  }

  getRandomTarget() {
    return configs.targets[Math.floor(Math.random() * configs.targets.length)];
  }
}

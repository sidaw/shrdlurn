import Display from "./display";
import SempreClient from "./sempre";
import configs from "./config";

export default class Game {
  constructor() {
    this.sessionId = configs.defaultSessionId;

    this.currentState = configs.emptyStruct;
    this.responses = [];
    this.selectedResp = -1;
    this.query = "";

    this.Sempre = new SempreClient();

    this.Display = new Display();
    this.Display.setup();
  }

  enter(query) {
    if (query.length == 0) this.Display.status("enter a command");
    // TODO: Validate length!
    this.querySempre(query);
  }

  querySempre(querystr) {
    const query = this.Sempre.formatQuery(querystr);

    const contextcommand = `(context (graph NaiveKnowledgeGraph ((string ${this.currentState}) (name b) (name c))))`;
    const cmds = { q: contextcommand, sessionId: this.sessionId };

    this.Sempre.query(cmds, function(jsonResp) {
      const cmds = { q: query, sessionId: this.sessionId };
      this.Sempre.query(cmds, function(response) {
        /* TODO:
        gs.taggedCover = jsonparse["taggedcover"];
        gs.taggedDefineCover = gs.taggedCover;
        */

       const formval = this.Sempre.parseSEMPRE(response['candidates']);
       if (formval == null) {
         console.log('no answer from sempre');
         this.resetResponses();
       } else {
         this.responses = formval;
         this.selectedResp = 0;
       }

       if (configs.debugMode) {
         console.log(response);
       }

       this.update();
     }.bind(this))

      // TODO: Update random utterances
    }.bind(this));
  }

  accept() {
    if (this.responses.length > 0) {
      this.Sempre.query({q: this.query, accept: this.responses[this.selectedResp].rank, sessionId: this.sessionId}, function(){});

      this.currentState = this.responses[this.selectedResp].value;
      this.Display.status(`✓: accepted (#${this.selectedResp}/${this.responses.length}), enter another command`);
      this.resetResponses();
      this.update();
    } else {
      this.Display.status(`✓: can't accept nothing, say something first`);
    }
  }

  resetResponses() {
    this.selectedResp = -1;
    this.responses = [];
    this.query = "";
  }

  update() {
    let afterStruct = configs.emptyStruct
    if (this.responses.length > 0) afterStruct = this.responses[this.selectedResp].value;
    this.Display.renderCanvas([this.currentState, afterStruct]);
  }

  clear() {
    this.resetResponses();
    this.currentState = configs.emptyStruct;
    this.update();
  }

  next() {
    if (this.responses.length <= 0) {
      this.Display.status("↓: can't scroll, say something or ⎌");
    } else if (this.selectedResp != this.responses.length - 1) {
      this.selectedResp++
      this.update()
      this.Display.status("↓: showing the next one");
    } else {
      this.Display.status("↓: already showing the last one");
    }
  }

  prev() {
    if (this.responses.length <= 0) {
      this.Display.status("↑: can't scroll, say something or ⎌");
    } else if (this.selectedResp != 0) {
      this.selectedResp++
      this.update()
      this.Display.status("↑: showing the previous one");
    } else {
      this.Display.status("↑: already showing the first one");
    }
  }
}

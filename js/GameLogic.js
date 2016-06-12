"use strict"
function GameState() {
  // the walls, just json strings
  this.currentWall = configs.emptyWall;
  this.targetWall = configs.emptyWall;
  this.listWalls = [];

  this.NBest = []; // current answer list returned by sempre
  this.NBestInd = 0;

  this.query = "";
  this.taskind = 0;

  this.log = {};
  this.log.numQueries = 0;
  this.log.totalTokens = 0;
  this.log.numScrolls = 0;

  this.nSteps = 1;
  this.maxSteps = 100;
  this.targetIndex = -1;
  this.skipsLeft = 2;
  if (configs.debugMode)
    this.skipsLeft = 100;

  this.tutorialMode = false;
  this.tutorialLevel = 2;

  this.coverage = [];
  this.define_coverage = [];
  this.taggedCover = [];
  this.taggedDefineCover = [];
  this.defineState = false;
  this.defineSuccess = "";
  this.reverting = -1;

  // the only persistent states
  this.sessionId = "deadbeef";
  this.successCounts = {}

  this.noAnswer = function() {
    return this.NBest==undefined || this.NBest.length == 0 || this.NBest.length == undefined
  }
  this.noQuery = function() {
    return this.query==undefined || this.query.trim().length==0
  }
  this.currentCandidate = function() {
    return this.NBest[this.NBestInd]
  }
  this.resetNBest = function() {
    this.NBest = []; // current answer list returned by sempre
    this.NBestInd = 0;
  }

  this.basicStatusMessage = function (mode) {
    var def =  ""
    if (this.query) {

    }
    if (mode == undefined)
      return def;
    else if (mode == "exec") {
      if (this.query.trim() == "")
      	return "??"
      return "executed: " + this.query
    } else if (mode == "accept") {
      if (this.noAnswer())
      	return "nothing to accept"
      return this.query + " # " + (this.NBestInd+1) + ": ✓"
    }
    else
      return mode + ', ' + def;
  }

  this.saveGameState = function() { }

  this.loadGameState = function() { }

  this.setPastWall = function(wall) {
    this.pastWall = wall;
  }

  this.getLastWall = function() {
    return this.listWalls[this.listWalls.length-1];
  }

  this.setCurrentWall = function() {
    if (this.NBest.length>0)
      this.currentWall = this.NBest[this.NBestInd].value;
    else
      this.currentWall = configs.emptyWall;
  }

  this.getCurrentWall = function() {
    if ( this.currentWall && this.currentWall.length > 0)
    {
      return this.currentWall;
    }
    return configs.emptyWall;
  }
  this.nextIfPossible = function() {
    if (this.noAnswer()) return false;
    if (this.NBestInd < this.NBest.length-1) {
      this.NBestInd++;
      this.currentWall = this.NBest[this.NBestInd].value;
      return true;
    }
    return false;
  }
  this.prevIfPossible = function() {
    if (this.noAnswer()) return false;
    if (this.NBestInd > 0) {
      this.NBestInd--;
      this.currentWall = this.NBest[this.NBestInd].value;
      return true;
    }
    return false;
  }

  this.getStandardQuery = function() {
    return {q: this.query, sessionId:this.sessionId}
  }

  this.getSuccessCount = function(levelid) {
    if (this.successCounts[levelid] == undefined)
      return 0;
    return this.successCounts[levelid]
  }
  this.incrementSuccessCount = function(levelid, amount) {
    if (this.successCounts[levelid] == undefined)
      this.successCounts[levelid] = amount;
    else {
      this.successCounts[levelid] = parseInt(this.successCounts[levelid])+amount;
    }
    util.setStore("successCounts", this.successCounts)
  }
}

var GS = new GameState();

function updateCanvas(gs) {
  var PSMain = PS.Main;
  var walls = [];

  if (!gs.noQuery() && gs.noAnswer() && !(gs.defineSuccess.length > 0)) {
    document.getElementById("show_define_status").className = "";
    updateStatus("SHRDLURN did not understand.");
  } else { document.getElementById("show_define_status").className = "hidden"}

  if (!gs.noAnswer()) {
    updateStatus("got " + gs.NBest.length + " options. use ↓ and ↑ to scroll, and ✓ to confirm.");
  }

  var wlen = gs.listWalls.length;
  var maxWalls = 1;

  // cut
  if (wlen <= maxWalls) {
    walls = walls.concat(gs.listWalls)
  } else { // shift left when the sequences gets too long
    walls = walls.concat(gs.listWalls.slice(wlen - maxWalls));
  }

  walls.push(gs.getCurrentWall());

  for (var i=0; i < maxWalls- wlen; i++)
    walls.push(configs.emptyWall);

  PSMain.renderJSON('['+walls.join(',')+']')();
  // updateGoalTextPosition(gs);
  updateFormula(gs);
  updateReaction(gs);
}

function newWall(gs) {
  var wallcommand = "(execute (call edu.stanford.nlp.sempre.cubeworld.RicherStacksWorld.getWorld (string {task})))"
      ._format({task: configs.levels[gs.taskind].id}); // attach arguments here!
  var cmds = {q:wallcommand, sessionId:gs.sessionId};
  gs.resetNBest();
  gs.query = "";
  gs.listWalls = [];

  sempre.sempreQuery(cmds, function (jsonstr) {
    if (jsonstr == "ERR_CONNECTION_REFUSED") {
      updateStatus("our server might be down...")
      return
    }
    var wall = JSON.parse(jsonstr)['commandResponse'];
    // var wall = jsresp.replace(/\(string /g, '').replace(/\)|\s/g, '');
    console.log("got this wall: " + wall);
    gs.listWalls.push(wall);
    //gs.targetWall = wall;
    gs.setCurrentWall();
    updateCanvas(gs);
    wipeHistory(gs, wall);
  })
}


var GameAction = {
    // functions starting with _ are internal, and should not modify status messages.
    _candidates: function(gs) {
    // if (gs.tutorialMode && (gs.tutorialLevel == 6 || gs.tutorialLevel == 12)) {
    //   if (gs.tutorialLevel == 6) gs.taggedCover = [["$Action", "add orange"], ["$UNK", "except", "the", "border"]];
    //   if (gs.tutorialLevel == 11) gs.taggedCover = [["$UNK", "add", "2"], ["$Color", "red"], ["$Cond", "if", "col", "=", "4", "or", "col", "=", "5"]];
    //   gs.taggedDefineCover = gs.taggedCover;
    //   gs.resetNBest();
    //   gs.setCurrentWall();
    //   updateCanvas(gs);
    //   return;
    // }

    var cmds = {q:gs.query, sessionId:gs.sessionId};

    sempre.sempreQuery(cmds , function(jsonstr) {
      var jsonparse = JSON.parse(jsonstr);
      console.log(jsonparse);
      gs.taggedCover = jsonparse["taggedcover"];
      gs.taggedDefineCover = gs.taggedCover;

      var formval = sempre.parseSEMPRE(jsonparse['candidates']);
      if (formval == null) {
	console.log('no answer from sempre')
        gs.resetNBest();
	gs.setCurrentWall();
      } else {
	gs.NBestInd = 0;
	gs.NBest = formval;
	gs.setCurrentWall();
      }
      if (configs.debugMode) {
	console.log(jsonparse);
	writeSemAns(gs);
      }
      updateCanvas(gs);
      if (gs.tutorialMode && (gs.tutorialLevel == 6 || gs.tutorialLevel == 12)) {
        GS.resetNBest();
        GS.setCurrentWall();
        updateCanvas(GS);
      }
    });

    // Update random utterances
    updateRandomUtterances(gs);
  },
  _simpleaccept: function(gs) {
    sempre.sempreQuery({q: gs.query, accept:gs.NBest[gs.NBestInd].rank, sessionId:gs.sessionId}, function(){})
  },
  candidates: function(gs) {
    var contextcommand = "(context (graph NaiveKnowledgeGraph ((string {wall}) (name b) (name c))))"
	._format({wall:gs.listWalls[gs.listWalls.length-1]}); // attach arguments here!
    var cmds = {q:contextcommand, sessionId:gs.sessionId};
    sempre.sempreQuery(cmds , function(jsonrespcontext) {
      GameAction._candidates(gs);
    });
  },
  prev: function(gs) {
    if (gs.noAnswer()) {
      updateStatus("↑: can't scroll, say something or or ⎌");
      return;
    }
    if (gs.prevIfPossible()) {
      updateCanvas(gs);
      updateStatus("↑: showing the previous one");
      Logger.log({type: "scroll", msg: "prev"});
    } else {
      updateStatus("↑: already showing the first one")
    }
    gs.log.numScrolls++;
  },
  next: function(gs) {
    if (gs.noAnswer()) {
      updateStatus("↓: can't scroll, say something or ⎌");
      return;
    }
    if (GS.nextIfPossible()) {
      updateCanvas(gs);
      updateStatus("↓: showing the next one");
      Logger.log({ type: "scroll", msg: "next" });
    } else {
      updateStatus("↓: already showing the last one");
    }
    gs.log.numScrolls++;
  },
  accept: function(gs) {
    GameAction._accept_commit(gs);
  },
  _accept_with_message: function(gs) {
    if (gs.noAnswer()) {
      updateStatus("✓: can't accept, say something first");
      return;
    }
    GameAction._simpleaccept(gs);
    //updateCanvas(GS)
    updateStatus("✓: confirmed (#{accept}/{length})"
		 ._format({accept:gs.NBestInd, length:gs.NBest.length}))
  },
  _accept_commit: function(gs) {
    if (!gs.noAnswer()) {
      GameAction._simpleaccept(gs);

      if (gs.currentWall == gs.targetWall) {
        completed_target();
      }

      var count = (gs.query.match(/then/g) || []).length;
      gs.nSteps += count + 1;
      gs.listWalls.push(gs.currentWall);
      gs.resetNBest();
      gs.query = "";
      gs.setCurrentWall();
      addPoint("accept");
      updateCanvas(gs);
      updateStatus("✓: accepted (#{accept}/{length}), enter another command"
		   ._format({accept:gs.NBestInd, length:gs.NBest.length}))
    } else {
      updateStatus("✓: can't accept nothing, say something first");
    }
  }
};

//*************** DOM stuff

function logh(strlog) {document.getElementById("history").innerHTML += strlog; }
function updateStatus(strstatus)
{
  document.getElementById("status").innerHTML = strstatus;
  if (GS.query && GS.query.length>0) {
    var stateinfo = "<b>↵: {query}</b>"._format({query:GS.query});
    if (!GS.noAnswer()) {
      stateinfo = "<b>↵: {query} (#{NBestInd}/{NBestlen})</b>"
	._format({query:GS.query, NBestInd:GS.NBestInd+1, NBestlen: GS.NBest.length});
    }
    document.getElementById("currentcmd").innerHTML = stateinfo;
  }
  else
    document.getElementById("currentcmd").innerHTML = "<b>enter a command</b>";
}

function writeSemAns(gs) {
  var sempreret = document.getElementById("nbestlist");
  var mystr = "<table> <tbody>"
  var formval = gs.NBest;
  for (var i in formval) {
    mystr += "<tr><td>"+
      (1+parseInt(i)) + "</td> <td>{rank}</td>  <td>{score} c:{count}</td> <td>{formulas}</td>  <td> {value} </td></tr>"
      ._format(formval[i]);
  }
  mystr += "</tbody> </table>"
  sempreret.innerHTML = mystr;
}

function updateReaction(gs) {
  var reaction =  document.getElementById('reaction');
  if (gs.noAnswer()) {
    reaction.innerHTML = util.emojione.numToImg(3);
  }
  else {
    var cc = gs.currentCandidate().maxprob;
    if (!cc) {cc = 0};
    var cutoffs = [0.5, 0.1, 0.05, 0.01, 0.001, 0.00001, -1];
    reaction.innerHTML = util.emojione.numToImg(cutoffs.findIndex(function(val){
      return cc >= val;
    }));
  }
}

function updateFormula(gs) {
  var formula =  document.getElementById('formula');
  if (gs.noAnswer()) {
    formula.innerHTML = "<b>No formula</b>";
  }
  else {
    formula.innerHTML = gs.currentCandidate().formula;
  }
}

// function updateGoalTextPosition(gs) {
//   var initx = 100; var inity = 280;
//   var g = document.getElementById("goalblocks");
//   var scalefactor = 800*0.75/1100.0; // this is radio of the widths of canvas in html vs stylesheet
//   var space = 5*35*scalefactor; // these should correspond to spacing and cubesize in Main.purs
//   g.style.top=(inity + (configs.levels[gs.taskind].maxSteps+1)*space*0.5)+"px"; //sin 30 and 60 due to isometry
//   g.style.left=(initx + (configs.levels[gs.taskind].maxSteps+1)*space*1.717/2)+"px";
// }

// State stuff

function updateRandomUtterances(gs) {
  sempre.sempreQuery({q:'(autocomplete "")', sessionId:gs.sessionId}, function(jsonstr) {
    var autocompletes = JSON.parse(jsonstr).autocompletes;
    var random_strings = "";
    for (var i = 0; i < 4 && i < autocompletes.length; i++) {
      random_strings += "<span>" + autocompletes[i] + "</span><br/>";
    }
    document.getElementById("random_utterances").innerHTML = random_strings;
  });
}

function saveGameState(gs, name) {
  // var state = { name: name, data: gs.listWalls[gs.listWalls.length - 1] };
  // var states = util.store.getItem("states");
  // if (states === null) { states = []; }
  // else { states = JSON.parse(states); }
  // states.push(state);
  // util.store.setItem("states", JSON.stringify(states));
  // popTasks();
}

function addElemToHistory(gs, history, text, definition) {
  if (definition == undefined) definition = false;
  if (gs.currentWall == "[[]]") { return; }

  var elem = document.createElement("div");
  elem.setAttribute("data-index", gs.listWalls.length - 1);
  elem.setAttribute("data-walls", gs.currentWall);
  if (!definition) {
    elem.setAttribute("data-steps", gs.nSteps);
    document.getElementById("recipe_steps").innerHTML = "(" + gs.nSteps + "/" + gs.maxSteps + ")";
    text = gs.nSteps + ". " + text;
  }
  elem.innerHTML = text;
  history.insertBefore(elem, history.firstChild);
  elem.onclick = function() {
    revertHistory(gs, elem.getAttribute("data-index"));
  }
  Logger.log({type: "action", msg: text});
}

Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

function updateHistory(gs) {
  var history = document.getElementById("command_history");
  var elems = history.childNodes;

  if (gs.reverting >= 0) {
    var found = false;
    while (found == false) {
      found = true;
      history = document.getElementById("command_history");
      elems = history.childNodes;
      for (var i = 0; i < elems.length; i++) {
        if (parseInt(elems[i].getAttribute("data-index")) > gs.reverting) {
          history.removeChild(elems[i]);
          found = false;
          break;
        }
      }
    }

    gs.reverting = -1;
  }

  addElemToHistory(gs, history, gs.query);

  highlightHistory(gs, -2);
}

function wipeHistory(gs, wall) {
  var history = document.getElementById("command_history");
  history.innerHTML = "";

  var elem = document.createElement("div");
  elem.setAttribute("data-index", -1);
  elem.setAttribute("data-walls", wall);
  elem.innerHTML = "initial";
  history.appendChild(elem);

  elem.onclick = function() {
    revertHistory(gs, elem.getAttribute("data-index"));
  }

  Logger.log({type: "history", msg: "clear"});
}

function highlightHistory(gs, index) {
  var elems = document.querySelectorAll("#command_history > div");
  for (var i = 0; i < elems.length; i++) {
    if (elems[i].getAttribute("data-index") == index) {
      elems[i].className = "active";
    } else {
      elems[i].className = "";
    }
  }
}

// http://stackoverflow.com/questions/5898656/test-if-an-element-contains-a-class
function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function undoHistory(gs) {
  var elems = document.querySelectorAll("#command_history > div");
  var index = elems[1].getAttribute("data-index");
  for (var i = 0; i < elems.length; i++) {
    if (hasClass(elems[i], "active")) {
      console.log(i);
      console.log(elems[i].getAttribute("data-index"));
      if (elems[i].getAttribute("data-index") == "-1") { return; }
      index = elems[i+1].getAttribute("data-index");
    }
  }
  revertHistory(gs, index);

  Logger.log({type: "history", msg: "undo"});
}

function redoHistory(gs) {
  var elems = document.querySelectorAll("#command_history > div");
  var index = elems[0].getAttribute("data-index");
  for (var i = elems.length - 1; i > 0; i--) {
    if (hasClass(elems[i], "active")) {
      index = elems[i-1].getAttribute("data-index");
    }
  }
  revertHistory(gs, index);

  Logger.log({type: "history", msg: "redo"});
}

function revertHistory(gs, index) {
  var elem = document.querySelectorAll("#command_history > div[data-index='" + index + "']")[0];
  var wall = elem.getAttribute("data-walls");
  PS.Main.renderJSON("[" + wall + ","+configs.emptyWall+"]")();

  if (gs.reverting >= 0) { gs.listWalls.pop(); }
  gs.listWalls.push(wall);
  gs.reverting = index;

  var steps = elem.getAttribute("data-steps");
  if (steps) {
    gs.nSteps = parseInt(steps) + 1;
  }

  highlightHistory(gs, index);


  Logger.log({type: "history", msg: "revert " + index});
}

/* Render the target state initially. */
window.addEventListener("load", new_target);

function new_target() {
  var index = 0;
  var completedTargets = JSON.parse(util.getStore("completed_targets", "[]"));
  if (completedTargets.length == STATES.length) {
    alert("No more targets.");
    return;
  }
  do {
    index = Math.floor(Math.random()*STATES.length);
  } while (completedTargets.indexOf(index) !== -1 && index !== GS.targetIndex);
  updateTarget(STATES[index], index);
  updateRandomUtterances(GS);
}

function loadGameState(gs, newWall) {
  gs.listWalls = [newWall];
  updateCanvas(gs);
  wipeHistory(gs, newWall);
}
//
// document.getElementById("prev_state").addEventListener("click", function() {
//   var index = document.getElementById("canvastarget").getAttribute("data-index");
//   index--;
//
//   if (index >= 0)
//     updateTarget(index);
// });
//
// document.getElementById("load_state").addEventListener("click", function() {
//   var canvas_target = document.getElementById("canvastarget")
//   var index = canvas_target.getAttribute("data-index");
//   var wall = canvas_target.getAttribute("data-wall");
//   loadGameState(GS, wall);
//   updateStatus("loaded a new state");
// });
//
// document.getElementById("next_state").addEventListener("click", function() {
//   var index = document.getElementById("canvastarget").getAttribute("data-index");
//   index++;
//   if (index != STATES.length) {
//     updateTarget(index);
//   } else {
//     updateTarget(index - 1);
//   }
// });

document.getElementById("clear_button").addEventListener("click", function() {
  GS.nSteps = 1;
  loadGameState(GS, configs.emptyWall);
});

function updateTarget(state, index) {
  var wall = state[1];
  // if (wall == "random")
  //   wall = randomWall();

  PS.Main.renderTargetJSON("[" + wall + "]")();
  GS.targetWall = wall;
  GS.targetIndex = index;
  GS.maxSteps = Math.round(state[0] * 2.5);

  var canvas_target = document.getElementById("canvastarget");
  canvas_target.setAttribute("data-wall", wall);
  canvas_target.setAttribute("data-index", index);
  document.getElementById("possible_steps_n").innerHTML = state[0];
  document.getElementById("max_steps_n").innerHTML = GS.maxSteps;
  document.getElementById("recipe_steps").innerHTML = "(" + 0 + "/" + GS.maxSteps + ")";
}

function randomWall() {
  var wall = "[";
  for (var i = 0; i < 64; i++) {
    var color = Math.floor(Math.random() * 10);
    if (color > 4) color = "";
    wall += "[" + color + "]";
    if (i != 63) wall += ",";
  }
  wall += "]";
  return wall;
}

// document.getElementById("save_state").onclick = function() {
//   var state_name = document.getElementById("state_name");
//   if (state_name.value.length > 0) {
//     saveGameState(GS, state_name.value);
//     state_name.value = "";
//     state_name.className = "";
//   } else {
//     state_name.className = "active";
//   }
// }
//
// document.getElementById("load_state").onclick = function() {
//   var t = document.getElementById("tasks");
//   var name = t.options[t.selectedIndex].value;
//   if (name == "random" || name == "empty") {
//     var taskstr = configs.levels[t.selectedIndex].name;
//     GS.taskind = t.selectedIndex;
//     newWall(GS);
//     updateStatus("selected level {task}"._format({task:taskstr}));
//   } else {
//     var states = JSON.parse(util.store.getItem("states"));
//     updateStatus("selected state {state}"._format({state:name}));
//     for (var i = 0; i < states.length; i++) {
//       if (states[i].name == name) {
//         loadGameState(GS, states[i]);
//         break;
//       }
//     }
//   }
// }

function addPoint(status) {
  var points = util.getStore("points", 0);
  points++;
  GS.incrementSuccessCount(status, 1);
  if (status=="success") {
    points+=10;
    GS.incrementSuccessCount(status, 10);
  }

  util.setStore("points", points);
  document.getElementById("game_points").innerHTML = points;
}

window.addEventListener("load", function() {
  var points = util.getStore("points", 0);
  document.getElementById("game_points").innerHTML = points;
})

// Query stuff

function runCurrentQuery(gs) {
  var querystr = document.getElementById("maintextarea").value.trim()
  document.getElementById("maintextarea").value = ''

  if (querystr.length>0) {
    if (!configs.debugMode && querystr.length > configs.uttLengthLimit) {
      alert("Instruction length is " + querystr.length
	    + " characters. Please limit it to less than "
	    + configs.uttLengthLimit
	    + " characters. Try to define concepts and use those instead of one long instruction.");
      return;
    }
    gs.log.totalTokens += querystr.split(" ").length;
    gs.log.numQueries++;

    logh(gs.numQueries + ' ' + querystr + '; ')
    gs.query = sempre.formatQuery(querystr);
    GameAction.candidates(gs);

    Logger.log({ type: "query", msg: gs.query });

  } else {
    updateStatus("enter a command");
  }
}

var maintextarea = document.getElementById("maintextarea");

function doQuery(e) {
  runCurrentQuery(GS);
  maintextarea.focus();
}

document.getElementById("dobutton").addEventListener("click", doQuery, false);

document.getElementById("prevbutton").onclick = function() {
  GameAction.prev(GS);
  maintextarea.focus();
};
document.getElementById("nextbutton").onclick = function() {
  GameAction.next(GS);
  maintextarea.focus();
};

document.getElementById("flyingaccept").onclick = function() {
  acceptOnclick();
};

function acceptOnclick() {
  // if (GS.tutorialMode) {
  //   if (GS.currentWall == GS.targetWall) {
  //     GameAction.accept(GS);
  //     updateHistory(GS);
  //   } else if (GS.tutorialLevel < 5) {
  //     updateStatus("Woops! That's not exactly right. Try again.");
  //     return;
  //   }
  // }

  if (GS.defineState) {
    alert("You must submit this definition first, then you can accept it!");
    return;
  }

  if (!configs.debugMode && GS.nSteps > GS.maxSteps) {
    alert("You have used the maximum number of steps. Undo some of your steps or clear to start over. You need to build the structure in less than the maxinum number of steps allowed. Try to define more complex phrases and use those rather than being overly specific.");
    return;
  }

  updateHistory(GS);
  GameAction.accept(GS);
  maintextarea.focus();
  Logger.log({type: "metaaction", msg: "accept"});
}
function metaCommand(meta) {
  maintextarea.value = meta;
  maintextarea.focus();
}

document.getElementById("paraphrase").onclick = function() {
  defineInterface(GS);
};

var Hotkeys = {
  ENTER: 13,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  Z : 90,
  D: 68,
  ESC: 27,
};

document.getElementById("maintextarea").onkeydown = function(e) {
  return true;
}

function parseKeys(e) {
  if (e.keyCode == Hotkeys.UP && e.target.id!="tasks") { // consider capture this in doc
    GameAction.prev(GS);
    return false;
  } else if (e.keyCode == Hotkeys.DOWN && e.target.id!="tasks") {
    GameAction.next(GS);
    return false;
  } else if (e.keyCode == Hotkeys.ENTER && e.shiftKey ) {
    acceptOnclick();
    return false;
  } else if (e.keyCode == Hotkeys.ENTER && !e.shiftKey) {
    if (GS.defineState) { definePhrase(e, GS); return false; }
    runCurrentQuery(GS); return false;
  } else if (e.keyCode == Hotkeys.Z && e.shiftKey && (e.ctrlKey || e.metaKey)) {
    redoHistory(GS); e.preventDefault(); return false;
  } else if (e.keyCode == Hotkeys.Z && (e.ctrlKey || e.metaKey)) {
    undoHistory(GS); e.preventDefault(); return false;
  } else if (e.keyCode == Hotkeys.D && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    if (GS.defineState && !(GS.tutorialMode && (GS.tutorialLevel == 7 || GS.tutorialLevel == 12))) {
      closeDefineInterface(GS); return false; }
    defineInterface(GS);
  } else if (e.keyCode == Hotkeys.ESC) {
    e.preventDefault();
    var help_reference = document.getElementById("reference");
    var submit = document.getElementById("submit_cover");
    var structs = document.getElementById("structs_modal");
    if (help_reference.className == "modal-container") {
      help_reference.className = "modal-container hidden";
    } else if (submit.className == "cover-container tutorial-s active") {
      closeSubmit(e);
    } else if (structs.className == "modal-container") {
      closeStructs(e);
    } else if (GS.defineState) {
      closeDefineInterface(GS);
    }
    return true;
  }
}

document.addEventListener("keydown", parseKeys, false);

// Define interface
function definePhrase(e, gs) {
  var definetextarea = document.getElementById("definetextarea");

  if (!configs.debugMode && definetextarea.value.length > configs.defLengthLimit) {
    alert("Definition length is " + definetextarea.value.length + " characters. Please limit it to less than 90 characters. Check out the help page for example commands, or try to define other phrases that would be building blocks to this one.");
    return;
  }

  /* If just trying, update current Wall */
  if (gs.defineSuccess.length == 0 || definetextarea.value != gs.defineSuccess) {
    var cmds = {q: "(uttdef \"" + sempre.formatQuery(definetextarea.value) + "\" -1)", sessionId: gs.sessionId };
    Logger.log({type: "try_define", msg: definetextarea.value });
    sempre.sempreQuery(cmds, function(jsonstr) {
      var jsonparse = JSON.parse(jsonstr);
      var formval = sempre.parseSEMPRE(jsonparse['candidates']);
      var commandResponse = jsonparse['commandResponse'];

      var defCore = commandResponse.indexOf("Core") != -1;
      var defNoCover = commandResponse.indexOf("NoCover") != -1;
      var defNoParse = commandResponse.indexOf("NoParse") != -1;

      if (defCore || defNoCover || defNoParse) {
        gs.define_coverage= jsonparse["coverage"];
        gs.taggedDefineCover = jsonparse["taggedcover"];
        defineInterface(gs, commandResponse);
        addPoint("fail");
      } else {
	gs.defineSuccess = definetextarea.value;
        gs.NBestInd = 0;
        gs.NBest = formval;
        gs.setCurrentWall();
        updateCanvas(gs);
        defineInterface(gs);
        document.getElementById("define_phrase_button").innerHTML = "define";
      }
    });
    return;
  }
  /* If already tried, submit definition */
  //sempre.sempreQuery({q: sempre.formatQuery(gs.query), sessionId: gs.sessionId }, function(jsonstr) {
  //});
  var text = "(uttdef \"" + sempre.formatQuery(gs.defineSuccess) + "\" " + gs.NBest[gs.NBestInd].rank + ")";
  var cmds = {q:text, sessionId:gs.sessionId};
  Logger.log({type: "define", msg: gs.defineSuccess });
  sempre.sempreQuery(cmds, function(jsonstr) {
    var jsonparse = JSON.parse(jsonstr);
    addElemToHistory(gs, document.getElementById("command_history"), ' defined "'
  		       + gs.query + '" as "' + gs.defineSuccess + '"', true);
    closeDefineInterface(gs);
    // consider populate the candidate list quietly,
    //GameAction._candidates(gs);
    gs.currentWall = configs.emptyWall;;
    gs.resetNBest();
    gs.setCurrentWall();
    updateCanvas(gs);
    document.getElementById("maintextarea").value = gs.query;
    updateStatus("definition accepted. thanks for teaching!");
    document.getElementById("show_define_status").className = "hidden";
    document.getElementById("define_phrase_button").innerHTML = "try it";
  });
}

function closeDefineInterface(gs) {
  // probably good to just run the query here

  var definetextarea = document.getElementById("definetextarea");
  var maintextarea = document.getElementById("maintextarea");
  definetextarea.value = "";
  maintextarea.value = "";
  var define_interface = document.getElementById("define_interface");
  define_interface.className = "hidden";

  maintextarea.className = "";
  var mainbuttons = document.getElementById("mainbuttons");
  mainbuttons.className = "buttons";
  maintextarea.focus();
  gs.defineSuccess = "";
  gs.defineState = false;
}

function getColoredSpan(coverage) {
  var colored_query = "";
  for (var i = 0; i < coverage.length; i++) {
    var type = coverage[i][0];
    switch (type) {
      case "$ActionSeq":
        colored_query += "<span class='color-good'>";
        break;
      case "$Action":
        colored_query += "<span class='color-good'>";
        break;
      case "$CondSeq":
        colored_query += "<span class='color-good'>";
        break;
      case "$Cond":
        colored_query += "<span class='color-good'>";
        break;
      case "$NumberSeq":
        colored_query += "<span class='color-good'>";
        break;
      case "$Number":
        colored_query += "<span class='color-good'>";
        break;
      case "$Color":
        colored_query += "<span style='color:blue;'>";
        break;
      case "$Keyword":
        colored_query += "<span style='color:blue;'>";
        break;
      case "$UNK":
        colored_query += "<span style='color:red;'>";
        break;
      default:
        colored_query += "<span style='color:red;'>";
    }
    for (var j = 1; j < coverage[i].length; j++) {
      console.log(coverage[i][j]);
      colored_query += coverage[i][j] + " ";
    }
    colored_query += "</span>";
    console.log(colored_query);
  }
  return colored_query;
}

function defineInterface(gs, status) {
  if (!gs.query) {
    updateStatus("nothing to define, enter a command.");
    return;
  }

  var define_header = document.getElementById("define_header");
  var define_status = document.getElementById("define_status");
  define_status.innerHTML = 'Teach SHRDLURN "' + gs.query + '". ';

  if (!gs.defineState) { // first time openning, or close and open
     if (!gs.noAnswer()) {
      // updateStatus("SHRDLURN already understands " + gs.query + "! Try scrolling too.");
      define_header.innerHTML = "Already understand \""
	+ gs.query + "\", teach another meaning?"
    } else {
      define_header.innerHTML = 'Didn\'t understand "' + getColoredSpan(gs.taggedCover) +'". Please rephrase:';
    }
  } else { // refinement
    if (gs.defineSuccess.length > 0 || gs.tutorialMode) {
      //updateStatus("SHRDLURN understands this!");
      define_header.innerHTML = 'SHRDLURN understands the definition, "' + gs.defineSuccess +'". If this is correct, click "define" to submit the definition.';
    } else {
      //updateStatus("SHRDLURN still does not understand you.");
      define_header.innerHTML = 'Still don\'t understand "' + getColoredSpan(gs.taggedDefineCover) +'". Please rephrase:';
    }

    // handle special status...
    if (status!=undefined) {
      var defCore = status.indexOf("Core") != -1;
      var defNoCover = status.indexOf("NoCover") != -1;
      console.log(status)
      if (defCore) {
	//updateStatus("cannot redefine the core language!");
	define_header.innerHTML = '"' + gs.query + '" is precisely understood, and cannot be redefined by "'+getColoredSpan(gs.taggedDefineCover)+'".';
      }
      else if (defNoCover) {
	//updateStatus("SHRDLRUN cannot learn from this definition");
	define_header.innerHTML = 'Nothing (colors, numbers, etc) in "' + getColoredSpan(gs.taggedDefineCover) + '" matches "' + gs.query
	  + '", so SHRDLURN cannot learn from this.';
      }
    }
  }

  // Hide maintextarea
  var maintextarea = document.getElementById("maintextarea");
  maintextarea.className = "hidden";
  var mainbuttons = document.getElementById("mainbuttons");
  mainbuttons.className = "hidden";

  console.log(gs.coverage);
  // Unhide define interface
  var define_interface = document.getElementById("define_interface");
  define_interface.className = "";
  var definetextarea = document.getElementById("definetextarea");
  definetextarea.placeholder = 'define "' + gs.query + '" here.';
  definetextarea.focus();

  gs.defineState = true;
}

function definePhraseClicked(e) {
  definePhrase(e, GS);
}

// function defineTryClicked(e) {
//   GS.defineSuccess = "";
//   definePhrase(e, GS);
// }

document.getElementById("define_phrase_button").addEventListener("click", definePhraseClicked, false);
//document.getElementById("define_try").addEventListener("click", defineTryClicked, false);
document.getElementById("definetextarea").oninput = function(e) {
  if (GS.defineSuccess.length > 0) {
    document.getElementById("define_phrase_button").innerHTML = "try it";
    GS.defineSuccess = "";
  }
};

document.getElementById("define_instead").addEventListener("click", function(e) {
  e.preventDefault();
  defineInterface(GS);
});
document.getElementById("close_define_interface").addEventListener("click", function(e) {
  if (GS.tutorialMode && (GS.tutorialLevel == 7 || GS.tutorialLevel == 12))
    return;
  closeDefineInterface(GS, false);
});

function simplereset() {
  GS.sessionId = util.getId();
  GS.successCounts = util.getStore("successCounts", {})
  // popTasks();
  newWall(GS);
  document.getElementById("maintextarea").focus();
}

document.getElementById("reset").onclick = function() {
  console.log("resetting!!")
  util.resetStore();
  simplereset();
}

simplereset();

var input = document.getElementById("definetextarea");
var onautocomplete = function(e) {
  if (configs.debugMode) console.log(e);
  if (input.value.endsWith(' '))
    autocomplete(GS, input.value);
  else if (input.value.length == 0)
    autocomplete(GS, "");
  e.stopPropagation();
};
input.addEventListener('input', onautocomplete, false);
input.addEventListener('focus', onautocomplete, false);

// make sure something happens even when autocomplete returns nothing
var awesomplete = new Awesomplete(input,
				  { minChars: 0,
				    list: ["remove if top red", "add yellow",
					   "add brown if has red or row = 3",
					   "add yellow if row = 3",
					   "repeat add yellow 3 times"],
				    filter : function() {return true}
				  });

function autocomplete(gs, prefix) {
  var cmdautocomp = '(autocomplete "' + prefix + '")';
  var cmds = {q:cmdautocomp, sessionId:gs.sessionId};

  sempre.sempreQuery(cmds, function (jsonstr) {
    var autocomps = JSON.parse(jsonstr)['autocompletes'];
    // var wall = jsresp.replace(/\(string /g, '').replace(/\)|\s/g, '');
    if (configs.debugMode)
      console.log("got these suggestions: " + autocomps);
    awesomplete.list = autocomps;
    // call awesomplete
    awesomplete.open();
    awesomplete.evaluate();
  })
}

document.getElementById("reject_button").addEventListener("click", function(e) {
  if (GS.NBest.length == 0) {
    alert("Nothing to reject.");
    return;
  }
  var cmds = {q: "(reject " + GS.NBestInd + ")", sessionId: GS.sessionId};
  sempre.sempreQuery(cmds, function(jsonstr) {
    var jsonparse = JSON.parse(jsonstr);
    GS.NBest.splice(GS.NBestInd, 1);
    GameAction.prev(GS);
  });
});

function completed_target() {
  if (GS.nSteps <= GS.maxSteps) {
    var completed_targets = JSON.parse(util.getStore("completed_targets", "[]"));
    completed_targets.push(GS.targetIndex);
    util.setStore("completed_targets", JSON.stringify(completed_targets));
    document.getElementById("target_completed").className = "modal-container";
  } else {
    alert("You used too many steps to build the target. Undo some steps and try again. Try to define some of the concepts you used and then use them.");
  }
}

document.getElementById("next_target").addEventListener("click", function(e) {
  document.getElementById("target_completed").className = "modal-container hidden";
  //document.getElementById("clear_button").click();
  //new_target();
});

document.getElementById("skip_target").addEventListener("click", function(e) {
  var completedTargets = JSON.parse(util.getStore("completed_targets", "[]"));
  if (completedTargets.length >= STATES.length - 1) {
    alert("No more targets.");
    return;
  }
  new_target();
  GS.skipsLeft--;
  var skip = document.getElementById("skip_target");
  if (GS.skipsLeft <= 0) {
    skip.parentNode.removeChild(skip);
  } else {
    skip.innerHTML = "skip (" + GS.skipsLeft + " left) &rarr;";
  }
  Logger.log({type: "metaaction", msg: "skip"});
});

window.addEventListener("load", function(e) {
  document.getElementById("skip_target").innerHTML = "skip (" + GS.skipsLeft + " left) &rarr;";
});

document.getElementById("submit_button").addEventListener("click", function() {
  document.getElementById("submit_cover").className = "cover-container tutorial-s active";
  document.getElementById("tutorial_overlay").className = "";
  document.getElementById("tutorial").className = "tutorial active";
  addCover("canvas");
});

document.getElementById("close_submit").addEventListener("click", closeSubmit);

function closeSubmit(e) {
  e.preventDefault();
  document.getElementById("submit_cover").className = "cover-container tutorial-s";
  document.getElementById("tutorial_overlay").className = "hidden";
  document.getElementById("tutorial").className = "tutorial";
  removeCover("canvas");
}

document.getElementById("submit_struct").addEventListener("click", function(e) {
  var submit_user = document.getElementById("submit_user");
  var submit_name = document.getElementById("submit_name");
  var username = submit_user.value;
  var name = submit_name.value;
  submit_user.value = '';
  submit_name.value = '';
  var wall = GS.listWalls[GS.listWalls.length-1];
  Logger.log({type: "submit", msg: username + ":" + wall});
  Logger.submit(username, name, wall, GS.nSteps);
  closeSubmit(e);
});

document.getElementById("view_structs").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("structs_modal").className = "modal-container";
  var structs = Logger.getStructs();
});

document.getElementById("close_structs_modal").addEventListener("click", closeStructs);

function closeStructs(e) {
  e.preventDefault();
  document.getElementById("structs_modal").className = "modal-container hidden";
}

function loadStruct(e) {
  e.stopPropagation();
  var target = e.target;
  var wall = e.target.getAttribute("data-wall");
  var steps = e.target.getAttribute("data-steps");
  updateTarget([steps, wall], -1);
  wipeHistory();
  closeStructs(e);
}

var Logger = new Logger();
Logger.init(GS);

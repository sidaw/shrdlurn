"use strict"
function GameState() {
    // the walls, just json strings
    this.currentWall = "[[]]";
    this.targetWall = "[[]]";
    this.listWalls = [];
    this.listNBestInd = []; // for score keeping

    this.NBest = []; // current answer list returned by sempre
    this.NBestInd = 0;

    this.query = "";
    this.taskind = 0;

    this.extraBits = 0;
    this.log = {};
    this.log.numQueries = 0;
    this.log.totalChars = 0;
    this.log.totalTokens = 0;
    this.log.numScrolls = 0;
    this.log.numStatus = 0;

    this.tutorialMode = false;
    this.tutorialLevel = 2;

    this.coverage = [];
    this.defineState = false;

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

    this.setCurrentWall = function() {
    	if (this.NBest.length>0)
    	    this.currentWall = this.NBest[this.NBestInd].value;
    	else
    	    this.currentWall = '[[]]';
    }

    this.getCurrentWall = function() {
    	if ( this.currentWall && this.currentWall.length > 0)
    	{
    	    return this.currentWall;
    	}
    	return '[[]]';
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
    this.incrementSuccessCount = function(levelid) {
    	if (this.successCounts[levelid] == undefined)
    	    this.successCounts[levelid] = 1;
    	else {
    	    this.successCounts[levelid] = parseInt(this.successCounts[levelid])+1;
    	}
    	util.setStore("successCounts", this.successCounts)
    	util.setStore("extraBits", this.extraBits)
    }
    this.effectiveStepsNumber = function() {
    	if (this.noAnswer()) return this.listWalls.length-1;
    	else return this.listWalls.length;
    }
}

var GS = new GameState();

function updateCanvas(gs) {
    var PSMain = PS.Main;
    var walls = [];

    var wlen = gs.listWalls.length;
    var maxWalls = configs.levels[gs.taskind].maxSteps;

    // cut
    if (wlen <= maxWalls) {
	walls = walls.concat(gs.listWalls)
    } else { // shift left when the sequences gets too long
	walls = walls.concat(gs.listWalls.slice(wlen - maxWalls));
    }

    walls.push(gs.getCurrentWall());

    for (var i=0; i < maxWalls- wlen; i++)
	walls.push('[[]]');
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
    gs.query = '';
    gs.listWalls = [];
    gs.listNBestInd = [];

    sempre.sempreQuery(cmds, function (jsonstr) {
	if (jsonstr == "ERR_CONNECTION_REFUSED") {
	    updateStatus("our server might be down...")
	    return
	}
	var jsresp = JSON.parse(jsonstr)['exValue'];
	var wall = jsresp.replace(/\(string /g, '').replace(/\)|\s/g, '');
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
	var cmds = {q:gs.query, sessionId:gs.sessionId};
	sempre.sempreQuery(cmds , function(jsonstr) {
	    var jsonparse = JSON.parse(jsonstr);
      gs.coverage = jsonparse["coverage"];
	    var formval = sempre.parseSEMPRE(jsonparse['candidates']);
	    if (formval == undefined) {
		console.log('undefined answer from sempre')
		return;
	    } else {
		gs.NBestInd = 0;
		gs.NBest = formval;
		gs.setCurrentWall();
	    }
	    if (configs.debugMode)
		writeSemAns(gs);
	    updateCanvas(gs);
	    GameAction.checkAnswer(gs);
	});
    },
    _godScroll: function(gs) { // mess with the nbest list, and put the right answer earlier when enabled.

    },
    _simpleaccept: function(gs) {
	sempre.sempreQuery({q: gs.query, accept:gs.NBest[gs.NBestInd].rank, sessionId:gs.sessionId}, function(){})
    },
    commitandcandidates: function(gs) { // implicit accept, might get junk data
	if (!gs.noAnswer()) {
	    updateStatus("accepted previous wall. use ↓ and ↑ to scroll.");
	    GameAction._simpleaccept(gs);
	    gs.listWalls.push(gs.currentWall);
	    gs.listNBestInd.push(gs.NBestInd);
	    gs.resetNBest();
	    gs.setCurrentWall();
	} else {
	    updateStatus("use ↓ and ↑ to scroll, ⎌ to undo, and ✓ to express approval");
	}

	var contextcommand = "(context (graph NaiveKnowledgeGraph ((string {wall}) (name b) (name c))))"
	    ._format({wall:gs.listWalls[gs.listWalls.length-1]}); // attach arguments here!
	var cmds = {q:contextcommand, sessionId:gs.sessionId};
	sempre.sempreQuery(cmds , function(jsonrespcontext) {
	    GameAction._candidates(gs);
	});
    },
    candidates: function(gs) {
	updateStatus("use ↓ and ↑ to scroll, ⎌ to undo, and ✓ to take the action.")
	var contextcommand = "(context (graph NaiveKnowledgeGraph ((string {wall}) (name b) (name c))))"
	    ._format({wall:gs.listWalls[gs.listWalls.length-1]}); // attach arguments here!
	var cmds = {q:contextcommand, sessionId:gs.sessionId};
	sempre.sempreQuery(cmds , function(jsonrespcontext) {
	    GameAction._candidates(gs);
	});
    },
    undo: function(gs) {
    	if (gs.noAnswer()) { // not in scrolling mode
    	    gs.resetNBest();
    	    gs.setCurrentWall();
    	    if ( gs.listWalls.length == 1) {
    		newWall(gs)
    		updateStatus("⎌: already at the start, got a new one instead.")
    	    } else {
    		// else pop the top and set it as context
    		gs.listWalls.pop();
    		gs.listNBestInd.pop();
    		if ( gs.listWalls.length == 1)
    		    updateStatus("⎌: undo again for a new one.")
    		else
    		    updateStatus("⎌: at the previous one")
    		GameAction.checkAnswer(gs)
    		updateCanvas(gs);
        highlightHistory(gs, gs.listWalls.length);
    	    }
    	} else { // scrolling
    	    gs.resetNBest();
    	    gs.setCurrentWall();
    	    updateStatus("⎌: cleared current actions")
    	    updateCanvas(gs);
    	}
    },
    nextLevel: function(gs) { // either the next random instance, or the next new level
	GameAction._simpleaccept(gs);
	gs.extraBits += gs.listNBestInd.reduce(function(a,b){return util.log2int(a)+util.log2int(b)},0) + util.log2int(gs.NBestInd);
	gs.resetNBest();
	gs.setCurrentWall();
	gs.incrementSuccessCount( configs.levels[gs.taskind].id );
	showNextButton(false);
	var curSucc = gs.getSuccessCount( configs.levels[gs.taskind].id );
	var minSucc = configs.levels[gs.taskind].minSuccess;

	if (gs.getSuccessCount( configs.levels[gs.taskind].id ) < configs.levels[gs.taskind].minSuccess) {
	    newWall(gs);
	    updateStatus("you did it! solve this puzzle " + (minSucc - curSucc) + " more times to advance.");
	    popTasks();
	    return false;
	}

	if (gs.taskind+1 < configs.levels.length) {
	    gs.taskind++;
	    newWall(gs);
	    updateStatus("the new level is: {levelname}"._format({levelname:configs.levels[gs.taskind].name}))
	    popTasks();
	    return true;
	} else {
	    updateStatus("You finished the game! Thanks for playing.");
	    popTasks();
	    return false;
	}

    },
    prev: function(gs) {
	if (gs.noAnswer()) {
	    updateStatus("↑: can't scroll, say something or or ⎌");
	    return;
	}
	if (gs.prevIfPossible()) {
	    updateCanvas(gs)
	    updateStatus("↑: showing the previous one")
	    GameAction.checkAnswer(gs)
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
	    updateCanvas(gs)
	    updateStatus("↓: showing the next one")
	    GameAction.checkAnswer(gs)
	} else {
	    updateStatus("↓: already showing the last one; <a href='' class='define-this'>define this instead</a>")
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
	    if (configs.hardMaxSteps
	    && gs.effectiveStepsNumber() >= configs.levels[gs.taskind].maxSteps) {
		updateStatus("accepted, but this is the last step, use ⎌ to go back, or ↑ ↓ to scroll.");
		return;
	    }
	    updateStatus("✓: accepted (#{accept}/{length}), enter another command"
		     ._format({accept:gs.NBestInd, length:gs.NBest.length}))
	    gs.listWalls.push(gs.currentWall);
	    gs.listNBestInd.push(gs.NBestInd);
	    gs.resetNBest();
	    gs.setCurrentWall();
	    updateCanvas(gs);
	} else {
	    updateStatus("✓: can't accept nothing, say something first");
	}
    },
    checkAnswer: function(gs) {
	if (gs.currentWall == gs.targetWall) {
	    showNextButton(true);
	    updateStatus("shift-enter or ✓ if this is what you want");
	    return true;
	} else {
	    showNextButton(false); return false;
	}
    }
};
//*************** DOM stuff

function showNextButton(show) {
    if (show) {
	document.getElementById("metaactions").style.visibility = "visible";
    } else {
	document.getElementById("metaactions").style.visibility = "visible";
    }
}
function logh(strlog) {document.getElementById("history").innerHTML += strlog; }
function updateStatus(strstatus)
{
    document.getElementById("status").innerHTML = strstatus
    GS.log.numStatus++;
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

function updateGoalTextPosition(gs) {
    var initx = 100; var inity = 280;
    var g = document.getElementById("goalblocks");
    var scalefactor = 800*0.75/1100.0; // this is radio of the widths of canvas in html vs stylesheet
    var space = 5*35*scalefactor; // these should correspond to spacing and cubesize in Main.purs
    g.style.top=(inity + (configs.levels[gs.taskind].maxSteps+1)*space*0.5)+"px"; //sin 30 and 60 due to isometry
    g.style.left=(initx + (configs.levels[gs.taskind].maxSteps+1)*space*1.717/2)+"px";
}

// State stuff

function saveGameState(gs, name) {
  var state = { name: name, data: gs.listWalls[gs.listWalls.length - 1] };
  var states = localStorage.getItem("states");
  if (states === null) { states = []; }
  else { states = JSON.parse(states); }
  states.push(state);
  localStorage.setItem("states", JSON.stringify(states));
  popTasks();
}

function loadGameState(gs, newState) {
  gs.listWalls = [];
  gs.listWalls.push(newState.data);
  updateCanvas(gs);
  wipeHistory(gs, newState.data);
}

function addElemToHistory(gs, history, text) {
    var elem = document.createElement("div");
    elem.setAttribute("data-index", gs.listWalls.length - 1);
    elem.setAttribute("data-walls", gs.listWalls[gs.listWalls.length - 1]);
    elem.innerHTML = text;
    history.insertBefore(elem, history.firstChild);
    elem.onclick = function() {
      revertHistory(gs, elem.getAttribute("data-index"));
    }
}

function updateHistory(gs) {
  var history = document.getElementById("command_history");

  for (var child = history.getElementsByTagName("div")[0]; !child || child.getAttribute("data-index") != gs.listWalls.length - 2; child = history.getElementsByTagName("div")[0]) {
    if (!child) break;
    history.removeChild(child);
  }
  highlightHistory(gs, -1);

  addElemToHistory(gs, history, gs.query);
}

function wipeHistory(gs, wall) {
  var history = document.getElementById("command_history");
  history.innerHTML = "";

  var elem = document.createElement("div");
  elem.setAttribute("data-index", 0);
  elem.setAttribute("data-walls", wall);
  elem.innerHTML = "initial";
  history.appendChild(elem);

  elem.onclick = function() {
    revertHistory(gs, elem.getAttribute("data-index"));
  }
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

function revertHistory(gs, index) {
  var elem;
  var testI = index;
  if (testI === "undo" || testI === "redo") {
    var elems = document.querySelectorAll("#command_history > div");
    var active = false;
    for (index = 1; elems[index].getAttribute("data-index") != 0; index++) {
      if (elems[index].getAttribute("data-index") == elems[index+1].getAttribute("data-index")) continue;
      if (hasClass(elems[index], "active")) {
        active = true;
        break;
      }
    }
    if (testI === "undo") { index++; }
    if (testI === "redo") { index--; }
    if (active) {
      elem = elems[index];
      index = elem.getAttribute("data-index");
    } else {
      if (testI === "undo") { index = 1; }
      index = elems[index].getAttribute("data-index");
      elem = elems[index];
    }
  } else {
    elem = document.querySelectorAll("#command_history > div[data-index='" + index + "']")[0];
  }

  gs.listWalls = gs.listWalls.slice(0, index);
  gs.listWalls.push(elem.getAttribute("data-walls"));
  updateCanvas(gs);
  highlightHistory(gs, index);
}

// DOM functions, and events
// consider retriving this list from sempre
function popTasks() {
    var ps = document.getElementById("tasks");
    ps.options.length = 0;
    console.log(JSON.parse(localStorage.getItem("states")));
    var states = configs.levels.concat(JSON.parse(localStorage.getItem("states")));
    for (var l in states) {
      if (!states[l]) continue;
  	  var p1 = document.createElement("option");
      p1.value = states[l].name;
    	p1.text =  (parseInt(l)+1) + " " + states[l].name;
    	p1.id = "state-" + states[l].id;
    	ps.appendChild(p1);
    }
    ps.selectedIndex = GS.taskind;
}

document.getElementById("tasks").onchange = function() {
    // var t = document.getElementById("tasks");
    // var taskstr = configs.levels[t.selectedIndex].name;
    // GS.taskind = t.selectedIndex;
    // GameAction.checkAnswer(GS);
    // newWall(GS);
    // updateStatus("selected level {task}"._format({task:taskstr}));
};

document.getElementById("save_state").onclick = function() {
  var state_name = document.getElementById("state_name");
  if (state_name.value.length > 0) {
    saveGameState(GS, state_name.value);
    state_name.value = "";
    state_name.className = "";
    document.getElementById("save_state").innerHTML = "Save Current State";
  } else {
    state_name.className = "active";
    document.getElementById("save_state").innerHTML = "Save This State";
  }
}

document.getElementById("load_state").onclick = function() {
  var t = document.getElementById("tasks");
  var name = t.options[t.selectedIndex].value;
  if (name == "random" || name == "empty") {
    var taskstr = configs.levels[t.selectedIndex].name;
    GS.taskind = t.selectedIndex;
    GameAction.checkAnswer(GS);
    newWall(GS);
    updateStatus("selected level {task}"._format({task:taskstr}));
  } else {
    var states = JSON.parse(localStorage.getItem("states"));
    updateStatus("selected state {state}"._format({state:name}));
    for (var i = 0; i < states.length; i++) {
      if (states[i].name == name) {
        loadGameState(GS, states[i]);
        break;
      }
    }
  }
}

function addPoint() {
  var points = localStorage.getItem("points");
  if (!points) points = 0;
  points++;
  localStorage.setItem("points", points);
  document.getElementById("game_points").innerHTML = points;
}

window.addEventListener("load", function() {
  var points = localStorage.getItem("points");
  if (!points) points = 0;
  document.getElementById("game_points").innerHTML = points;
})

// Query stuff

function runCurrentQuery(gs) {
    var querystr = document.getElementById("maintextarea").value.trim()
    document.getElementById("maintextarea").value = ''

    if (querystr.length>0) {
	gs.log.totalTokens += querystr.split(" ").length;
	gs.log.numQueries++;
	gs.log.totalChars += querystr.length;
	if (configs.hardMaxSteps
	    && gs.effectiveStepsNumber() >= configs.levels[gs.taskind].maxSteps) {
	    updateStatus("entered \"" + querystr +"\", but used too many steps, ⎌ first.");
	} else {

	    logh(gs.numQueries + ' ' + querystr + '; ')
	    gs.query = querystr;
	    GameAction.candidates(gs);
	}
    } else {
	updateStatus("enter a command");
    }
}

var maintextarea = document.getElementById("maintextarea");
document.getElementById("dobutton").onclick = function() {
    runCurrentQuery(GS);
    maintextarea.focus();
};
// document.getElementById("undobutton").onclick = function() {
//     revertHistory(GS, "undo");
// };
// document.getElementById("redobutton").onclick = function() {
//     revertHistory(GS, "redo");
// };
document.getElementById("prevbutton").onclick = function() {
    GameAction.prev(GS);
    maintextarea.focus();
};
document.getElementById("nextbutton").onclick = function() {
    GameAction.next(GS);
    maintextarea.focus();
};

function acceptOnclick() {
  //   if (GameAction.checkAnswer(GS)) {
	// GameAction.nextLevel(GS)
	// ga('send', 'event', "custom", "passedlevel", GS.taskInd);
  //   } else {

  if (GS.tutorialMode) {
    console.log(GS.currentWall);
    console.log(GS.targetWall);
    if (GS.currentWall == GS.targetWall) {
      console.log("WON!");
      GameAction.accept(GS);
      updateHistory(GS);
      addPoint();
      GS.tutorialLevel++;
      nextTutorial(GS.tutorialLevel);
    } else if (GS.tutorialLevel < 4) {
      alert("Woops! That's not exactly right. Try again.");
      return;
    }
  }

	GameAction.accept(GS);
  maintextarea.focus();
  updateHistory(GS);
  addPoint();
}
function metaCommand(meta) {
    maintextarea.value = meta;
    maintextarea.focus();
}

// document.getElementById("acceptbutton").onclick = function() {
//     acceptOnclick()
// };
document.getElementById("flyingaccept").onclick = function() {
    metaCommand("!accept")
};
// document.getElementById("describe").onclick = function() {
//     metaCommand("!instead_of [" + GS.query + "] you_did: ")
// };
document.getElementById("paraphrase").onclick = function() {
    //metaCommand("!define [" + GS.query + "] as: ");
    defineInterface(GS);
};

var Hotkeys = {
    ENTER: 13,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    Z : 90,
};

document.getElementById("maintextarea").onkeydown = function(e) {
    return true;
}
document.onkeydown = function(e) {
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
      revertHistory(GS, "redo"); return false;
    } else if (e.keyCode == Hotkeys.Z && (e.ctrlKey || e.metaKey)) {
	     revertHistory(GS, "undo"); return false;
    } return true;
};

document.getElementById("reset").onclick = function() {
    console.log("resetting!!")
    util.resetStore();
    GS.sessionId = util.getId();
    GS.successCounts = util.getStore("successCounts", {});
    GS.extraBits = util.getStore("extraBits", 0);
    popTasks();
    newWall(GS);
    document.getElementById("maintextarea").focus();
}

// Tutorial
window.addEventListener("load", function() {
  var tutorial_token = localStorage.getItem("tutorial_token");
  if (!tutorial_token) {
    document.getElementById("tutorial").className = "tutorial active";
    document.getElementById("canvastarget").className = "active";
    document.getElementById("goalblocks").className = "active";
    document.getElementById("states").className = "states";
    PS.Main.renderTargetJSON("[[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]]")();
    GS.tutorialMode = true;
  } else {
    document.getElementById("states").className = "states active";
  }
})

function nextTutorial(i) {
  console.log(i);
  document.getElementById("tutorial-s" + (i - 1)).className = "tutorial-s";
  document.getElementById("tutorial-s" + i).className = "modal-container tutorial-s active";
}

document.getElementById("skip_tutorial").onclick = function() {
  localStorage.setItem("tutorial_token", "true");
  document.getElementById("tutorial").className = "tutorial";
}

document.getElementById("start_tutorial").onclick = function() { nextTutorial(2); }

document.getElementById("next_tutorial1").onclick = function() {
  document.getElementById("tutorial-s2").className = "tutorial-s";
  document.getElementById("maintextarea").focus();
  var taskstr = configs.levels[1].name;
  GS.taskind = 1;
  newWall(GS);
  GS.targetWall = "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4]]";
}

document.getElementById("next_tutorial2").onclick = function() {
  document.getElementById("tutorial-s3").className = "tutorial-s";
  document.getElementById("maintextarea").focus();
  GS.targetWall = "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]";
}

document.getElementById("next_tutorial3").onclick = function() {
  document.getElementById("tutorial-s4").className = "tutorial-s";
  document.getElementById("maintextarea").focus();
  GS.targetWall = "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]";
}

document.getElementById("finish_tutorial").onclick = function() {
  localStorage.setItem("tutorial_token", true);
  document.getElementById("tutorial").className = "tutorial";
  document.getElementById("canvastarget").className = "";
  document.getElementById("goalblocks").className = "";
  document.getElementById("states").className = "";
  GS.tutorialMode = false;
  document.getElementById("states").className = "states active";
}


// Define interface

function definePhrase(e, gs) {
  var definetextarea = document.getElementById("definetextarea");
  var maintextarea = document.getElementById("maintextarea");
  var text = "(uttdef \"" definetextarea.value "\")";
  maintextarea.value = text;
  runCurrentQuery(gs);
  definetextarea.value = "";

  var define_interface = document.getElementById("define_interface");
  define_interface.className = "hidden";

  maintextarea.className = "";
  var mainbuttons = document.getElementById("mainbuttons");
  mainbuttons.className = "buttons";

  addPoint();
  addElemToHistory(gs, document.getElementById("command_history"), text);

  gs.defineState = false;
}


function defineInterface(gs) {
  if (!gs.query) {
    updateStatus("no query to define, enter a query:");
    return;
  }

  // Hide maintextarea
  var maintextarea = document.getElementById("maintextarea");
  maintextarea.className = "hidden";
  var mainbuttons = document.getElementById("mainbuttons");
  mainbuttons.className = "hidden";

  // Normalize coverages
  var max = 0;
  for (var i = 0; i < gs.coverage.length; i++) {
    if (gs.coverage[i] > max) max = gs.coverage[i];
  }

  var normalized_coverages = [];
  for (var i = 0; i < gs.coverage.length; i++) {
    normalized_coverages[i] = Math.floor(255 - ((gs.coverage[i] / max) * 255));
  }

  // Color the query
  var colored_query = gs.query.split(" ");
  for (var i = 0; i < colored_query.length; i++) {
    colored_query[i] = "<span style='color:rgb(" + normalized_coverages[i] + ",0,0)' >" + colored_query[i] + "</span>";
  }

  var query_phrase = document.getElementById("query_phrase");
  query_phrase.innerHTML = colored_query.join(" ");
  console.log(gs.coverage);

  // Unhide define interface.
  var define_interface = document.getElementById("define_interface");
  define_interface.className = "";

  gs.defineState = true;

  document.getElementById("define_phrase_button").addEventListener("click", function(e) {
    definePhrase(e, gs);
  });
}

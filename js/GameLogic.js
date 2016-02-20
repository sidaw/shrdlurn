"use strict"
// captures the game state
String.prototype._format = function(placeholders) {
    var s = this;
    for(var propertyName in placeholders) {
        var re = new RegExp('{' + propertyName + '}', 'gm');
        s = s.replace(re, placeholders[propertyName]);
    }    
    return s;
};

function GameState() {
    // the walls, just json strings
    this.currentWall = "[[]]";
    this.targetWall = "[[]]";
    this.listWalls = [];
    
    this.NBest = []; // current answer list returned by sempre
    this.NBestInd = 0;
    this.sessionId = "deadbeef";
    
    this.query = "";
    this.task = "0.0 basics";

    this.numsteps = 1;
    this.debug = true;

    this.noAnswer = function() {
	return this.NBest==undefined || this.NBest.length == 0 || this.NBest.length == undefined
    }
    this.noQuery = function() {
	return this.query==undefined || this.query.trim().length==0
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
    
    this.saveGameState = function() {
    }

    this.loadGameState = function() {
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
	if (this.noAnswer()) return
	if (this.NBestInd < this.NBest.length-1)
	    this.NBestInd++;
	this.currentWall = this.NBest[this.NBestInd].value;
    }
    this.prevIfPossible = function() {
	if (this.noAnswer()) return
	if (this.NBestInd > 0)
	    this.NBestInd--;
	this.currentWall = this.NBest[this.NBestInd].value;
    }

    this.getStandardQuery = function() {
	return {q: this.query, sessionId:this.sessionId}
    }
}

var GS = new GameState();

function updateCanvas(gs) {
    var PSMain = PS.Main;
    var walls = [];
    
    walls = walls.concat(gs.listWalls)
    walls.push(gs.getCurrentWall())
    var MAXSTEPS = 3;
    for (var i=0; i < MAXSTEPS - gs.listWalls.length; i++)
	walls.push('[[]]')
    walls.push(gs.targetWall)
    
    PSMain.renderJSON('['+walls.join(',')+']')()
}

function updateCurrentWall(gs, jsonstr) {
    var formval = sempre.parseSEMPRE(jsonstr);
    if (formval == undefined) {
	console.log('undefined answer from sempre')
	return
    }
    gs.NBestInd = 0;
    gs.NBest = formval;
    gs.setCurrentWall();
}

function newWall(gs) {
    var wallcommand = "(execute (call edu.stanford.nlp.sempre.cubeworld.StacksWorld.getLevel (string {task})))"._format(gs); // attach arguments here!
    var cmds = {q:wallcommand, sessionId:gs.sessionId};
    sempre.sempreQuery(cmds, function (jsonstr) {
	var jsresp = JSON.parse(jsonstr)['lines'];
	var walls = jsresp[0].replace(/\(string /g, '').replace(/\)|\s/g, '').split('|');
	console.log(walls);
	gs.listWalls = [];
	gs.listWalls.push(walls[0]);
	gs.targetWall = walls[1];
	gs.resetNBest();
	gs.setCurrentWall();
	gs.query = '';
	updateCanvas(gs);
    })
}


var GameAction = {
    candidates: function(gs) {
	updateStatus("↵: {query}"._format(gs));
	var cmds = {q:gs.query, sessionId:gs.sessionId};
	sempre.sempreQuery(cmds , function(jsonstr) {
	    updateCurrentWall(gs, jsonstr);
	    if (gs.debug)
		writeSemAns(gs);
	    updateCanvas(gs);
	});
    },

    commitandcandidates: function(gs) {
	if (!gs.noAnswer()) {
	    console.log("use current answer, accept, and clear Nbest");
	    sempre.sempreQuery({q: gs.query, accept:gs.NBestInd, sessionId:gs.sessionId}, function(){})
	    gs.listWalls.push(gs.currentWall);
	    gs.resetNBest();
	    gs.setCurrentWall();
	}
	var contextcommand = "(context (graph NaiveKnowledgeGraph ((string {wall}) (name b) (name c))))"
	    ._format({wall:gs.listWalls[gs.listWalls.length-1]}); // attach arguments here!
	var cmds = {q:contextcommand, sessionId:gs.sessionId};
	sempre.sempreQuery(cmds , function(jsonrespcontext) {
		GameAction.candidates(gs);
	});
    },
    undo: function(gs) {
	if (gs.noAnswer()) { // not in scrolling mode
	    gs.resetNBest();
	    gs.setCurrentWall();
	    if ( gs.listWalls.length == 1) {
		newWall(gs)
		updateStatus("⎌: already at the start, got a new wall.")
	    } else {
		// else pop the top and set it as context
		gs.listWalls.pop();
		if ( gs.listWalls.length == 1)
		    updateStatus("⎌: undo again for new instance.")
		else
		    updateStatus("⎌: at the previous wall")
	    }
	    updateCanvas(gs);
	} else { // scrolling
	    gs.resetNBest();
	    gs.setCurrentWall();
	    updateStatus("⎌: cleared current choices")
	    updateCanvas(gs);
	}
    },
    random: function(gs) {
	newWall(gs)
	updateStatus("got a random wall.")
    },

    prev: function(gs) {
	gs.prevIfPossible()
	updateCanvas(gs)
	updateStatus("↑: showing the previous candidate")
    },

    next: function(gs) {
	GS.nextIfPossible()
	updateCanvas(gs)
	updateStatus("↓: showing the next candidate")
    },
    accept: function(gs) {
	sempre.sempreQuery({q: gs.query, accept:gs.NBestInd, sessionId:gs.sessionId}, function(){})
	//updateCanvas(GS)
	updateStatus("✓: confirmed.")
    }
};
//*************** DOM stuff

function logh(strlog) {document.getElementById("history").innerHTML += strlog + "; " }
function updateStatus(strstatus)
{
    document.getElementById("status").innerHTML = strstatus
    
    if (GS.query && GS.query.length>0) {
	var stateinfo = "<b>↵: {query}"._format({query:GS.query});
	if (!GS.noAnswer()) {
	    stateinfo = "<b>↵: {query} (#{NbestInd}/{Nbestlen})</b>"
		._format({query:GS.query, NbestInd:GS.NBestInd+1, Nbestlen: GS.NBest.length});
		if (this.debug)
		    stateinfo += "\n (formula " + this.NBest[this.NBestInd].formula +")";
	}
	document.getElementById("currentcmd").innerHTML = stateinfo;
    }
    else
	document.getElementById("currentcmd").innerHTML = "<b>enter a command</b>"
}


function writeSemAns(gs) {
    document.getElementById("sempreret").innerHTML = ''
    var formval = gs.NBest;
    for (i in formval)
	document.getElementById("sempreret").innerHTML +=
    (1+parseInt(i)) + ' : (prob={prob},score={score}): {formula}'._format(formval[i]) +
	'<br/>';
}

// DOM functions, and events
// consider retriving this list from sempre
function popTasks() {
    var puzzles = ['0.0 basics', '0.1 actions',
		   '0.2 logic?',
		   '1.0 castle', , '1.1 checker',
		   '1.2 triangle'];
    var ps = document.getElementById("tasks");

    var poplist = function(prefix, strlist) {
	for (var t in strlist)
	{
	    var p1 = document.createElement("option");
	    p1.text = prefix + strlist[t];
	    ps.appendChild(p1);
	}
    }
    poplist('', puzzles);
}


document.getElementById("tasks").onchange = function() {
    var t = document.getElementById("tasks");
    var taskstr = t.options[t.selectedIndex].value;
    GS.task = taskstr;
    updateStatus("selected level {task}"._format({task:taskstr}));
    newWall(GS);
    
};

function runCurrentQuery() {
    var querystr = document.getElementById("maintextarea").value
    document.getElementById("maintextarea").value = ''
    logh('  ' + querystr)

    if (querystr.length>0) {
	GS.query = querystr;
	GameAction.commitandcandidates(GS);
    } else {
	//document.getElementById("maintextarea").value = GS.query
    }
}
document.getElementById("dobutton").onclick = function() {
    runCurrentQuery();
};
document.getElementById("undobutton").onclick = function() {
    GameAction.undo(GS);
};
document.getElementById("prevbutton").onclick = function() {
    GameAction.prev(GS);
};
document.getElementById("nextbutton").onclick = function() {
    GameAction.next(GS);
};
document.getElementById("acceptbutton").onclick = function() {
    GameAction.accept(GS);
};

var Hotkeys = {
    ENTER: 13,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    Z : 90
};

document.onkeydown = function(e) {
    if (e.keyCode == Hotkeys.UP) {
	GameAction.prev(GS);
	return false;
    } else if (e.keyCode == Hotkeys.DOWN) {
	GameAction.next(GS);
	return false;
    } else if (e.keyCode == Hotkeys.ENTER && e.shiftKey ) {
	GameAction.accept(GS);
	return false;
    } else if (e.keyCode == Hotkeys.ENTER && !e.shiftKey) {
	runCurrentQuery(); return false;
    } else if (e.keyCode == Hotkeys.Z && (e.ctrlKey || e.metaKey)) {
	GameAction.undo(GS); return false;
    } return true;
};

popTasks();
newWall(GS);
document.getElementById("maintextarea").focus()

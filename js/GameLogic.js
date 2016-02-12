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
    this.originalWall = "[[]]";
    this.currentWall = "[[]]";
    this.goalWall = "[[]]";
    
    this.semAns = {}; // current answer list returned by sempre
    this.semAnsInd = 0;
    this.sessionId = "deadbeef";
    
    this.query = "";
    this.mode = "train";
    this.task = "baby_wall";

    this.numsteps = 1;

    this.noAnswer = function() {
	return this.semAns.length==undefined || this.semAns.length == 0
    }
    this.statusMessage = function (mode) {
	this.numsteps++;
	return this.numsteps +") "+  this.basicStatusMessage(mode)
    }
    this.basicStatusMessage = function (mode) {
	var def =  this.mode + " mode"
	if (this.query) {
	    def += ", command: " + this.query
	    if (!this.noAnswer())
		def += ", showing # " + (this.semAnsInd+1) + "/" + this.semAns.length;
	}
	if (mode == undefined)
	    return def;
	else if (mode == "describe")
	    return "no, what you did was: " + this.query
	else if (mode == "exec") {
	    if (this.query.trim() == "")
		return "nothing to execute, type a command"
	    return "executed: " + this.query
	} else if (mode == "accept") {
	    if (this.noAnswer())
		return "nothing to accept"
	    return "accepted #" + (this.semAnsInd+1) + " for " + this.query
	}
	else
	    return mode + ', ' + def;
    }
    
    this.saveGameState = function() {
    }

    this.loadGameState = function() {
    }

    this.setCurrentWall = function() {
	this.currentWall = this.semAns[this.semAnsInd].value;
    }
    
    this.getCurrentWall = function() {
	if ( this.currentWall && this.currentWall.length > 0)
	{
	    // hack for debugging sets
	    var isAction = this.currentWall.indexOf('true') == -1 && this.currentWall.indexOf('false')==-1
	    if (isAction)
		return this.currentWall;
	}
	return '[[]]';
    }
    this.nextIfPossible = function() {
	if (this.noAnswer()) return
	if (this.semAnsInd < this.semAns.length-1)
	    this.semAnsInd++;
	 this.currentWall = this.semAns[this.semAnsInd].value;
    }
    this.prevIfPossible = function() {
	if (this.noAnswer()) return
	if (this.semAnsInd > 0)
	    this.semAnsInd--;
	 this.currentWall = this.semAns[this.semAnsInd].value;
    }
}

var GS = new GameState();

// changes game state when task changes
function taskChanged(gs, taskstr)
{
    if (taskstr.startsWith('train:'))
	gs.mode = 'train';
    else
	gs.mode = 'puzzle'
    gs.task = taskstr.replace(/(train:|puzzle:)\s*/g, '');
}

function updateCanvas(gs) {
    var PSMain = PS.Main;
    var wallpair = '[' + gs.originalWall + ',' + gs.getCurrentWall() + ']';
    PSMain.renderJSON(wallpair)(gs.targetWall)()
}

function updateCurrentWall(gs, jsonstr) {
    var formval = sempre.parseSEMPRE(jsonstr);
    if (formval == undefined) {
	console.log('undefined answer from sempre')
	return
    }
    gs.semAnsInd = 0;
    gs.semAns = formval;
    gs.setCurrentWall();
}

function newWall(gs) {
    querystr = "_newInitialWall " + gs.task; // attach arguments here!
    if (gs.mode == "train") {
	sempre.sempreQuery(querystr, function (jsonstr) {
	    var formval = sempre.parseSEMPRE(jsonstr);
	    gs.originalWall = formval[0].value;
	    
	    if (gs.mode=="train") {
		gs.targetWall = formval[0].value;
	    }

	    if (gs.query.length > 0){
		GameAction.tryaction(gs)
	    }
	updateCanvas(gs)
    })
    } else {
	gs.originalWall = '[[0,0,0],[1,1,1]]'
	gs.currentWall = '[[0,0,0],[1,1,1]]'
	gs.targetWall = '[[1,1,1],[0,0,0]]'
	updateCanvas(gs)
    }
}


function toSempreWall(jsonstr) {
    console.log(jsonstr)
    return jsonstr.replace(/\s/g, "").replace(/\],\[/g, "__").replace(/,/g, "_").replace(/(\[\[|\]\])/g, "")
}

var GameAction = {
    tryaction: function(gs) {
	var sempreq = 'parse ' + gs.query;
	sempre.sempreQuery(sempreq , function(jsonstr) {
	    updateCurrentWall(gs, jsonstr);
	    writeSemAns(gs);
	    updateCanvas(gs);
	    updateStatus(gs.statusMessage())
	});
    },
    
    commit: function(gs) {
	var wallstr = toSempreWall(gs.currentWall)
	sempre.sempreQuery('_setCurrentWall ' + wallstr , function(jsonstr) {
	    var formval = sempre.parseSEMPRE(jsonstr);
	    if (formval == undefined) {
		console.log('undefined answer from sempre')
		return
	    }
	    gs.originalWall = formval[0].value;
	    updateCanvas(gs);
	    updateStatus(gs.statusMessage("exec"))
	});
    },
    
    random: function(gs) {
	newWall(gs)
	updateStatus(gs.statusMessage("got a random wall"))
	 
    },

    prev: function(gs) {
	gs.prevIfPossible()
	updateCanvas(gs)
	updateStatus(gs.statusMessage())
    },

    next: function(gs) {
	GS.nextIfPossible()
	updateCanvas(gs)
	updateStatus(gs.statusMessage())
    },

    randact: function(gs) {
	newWall(gs)
	updateStatus(gs.statusMessage("took a random action"))
    },

    accept: function(gs) {
	sempre.sempreCommand({q:"parse " + gs.query, accept:gs.semAnsInd, sessionId:gs.sessionId})
	//updateCanvas(GS)
	updateStatus(gs.statusMessage("accept"))
    },

    describe: function(gs) {
	updateStatus(GS.statusMessage("describe"))
    }
};
//*************** DOM stuff

function logh(strlog) {document.getElementById("history").innerHTML += strlog + "; " }
function updateStatus(strstatus)
{
    document.getElementById("status").innerHTML = strstatus
    if (GS.query && GS.query.length>0)
	document.getElementById("currentcmd").innerHTML = "<b>Current command: </b>" + GS.query
    else
	document.getElementById("currentcmd").innerHTML = "<b>No command</b>"
}


function writeSemAns(gs) {
    document.getElementById("sempreret").innerHTML = ''
    var formval = gs.semAns;
    for (i in formval)
	document.getElementById("sempreret").innerHTML +=
    '(prob={prob},score={score}): {formula}'._format(formval[i]) +
	'<br/>';
}

// DOM functions, and events
function popTasks() {
    var trainers = ['baby_wall', 'binary_wall', 'random_wall'];
    var puzzles = ['baby_speak', 'temp_variables', 'chessboard', 'binary_adder'];
    var ps = document.getElementById("tasks");

    var poplist = function(prefix, strlist) {
	for (var t in strlist)
	{
	    var p1 = document.createElement("option");
	    p1.text = prefix + strlist[t];
	    ps.appendChild(p1);
	}
    }
    poplist('train: ', trainers);
    poplist('puzzle: ', puzzles);
}

document.getElementById("trybutton").onclick = function() {
    querystr = document.getElementById("maintextarea").value;
    if (querystr.length>0) {
	GS.query = querystr
	GameAction.tryaction(GS);
    }
};
document.getElementById("dobutton").onclick = function() {
    GameAction.commit(GS);
};
document.getElementById("randbutton").onclick = function() {
    GameAction.random(GS);
};
document.getElementById("prevbutton").onclick = function() {
    GameAction.prev(GS);
};
document.getElementById("nextbutton").onclick = function() {
    GameAction.next(GS);
};
document.getElementById("randactionbutton").onclick = function() {
    GameAction.randact(GS);
};
document.getElementById("happybutton").onclick = function() {
    GameAction.accept(GS);
};
document.getElementById("describebutton").onclick = function() {
    GameAction.describe(GS);
};


document.getElementById("tasks").onchange = function() {
    var t = document.getElementById("tasks");
    var taskstr = t.options[t.selectedIndex].value;
    taskChanged(GS, taskstr);
    if (GS.mode == "train") {
	document.getElementById("prevbutton").disabled = false;
	document.getElementById("nextbutton").disabled = false;
	document.getElementById("randactionbutton").disabled = false;
	document.getElementById("happybutton").disabled = false;
	document.getElementById("describebutton").disabled = false;
    } else {
	document.getElementById("prevbutton").disabled = true;
	document.getElementById("nextbutton").disabled = true;
	document.getElementById("randactionbutton").disabled = true;
	document.getElementById("happybutton").disabled = true;
	document.getElementById("describebutton").disabled = true;
    }
    newWall(GS);
    updateStatus(GS.statusMessage())
};

function runCurrentQuery() {
    var querystr = document.getElementById("maintextarea").value
    document.getElementById("maintextarea").value = ''
    logh('  ' + querystr)
    updateStatus(GS.statusMessage())
    
    if (querystr.startsWith("?")) {
	GameAction.random(GS);
    }
    else if (querystr.startsWith(")")) {
	GameAction.accept(GS);
    }
    else if (querystr.startsWith("<")) {
	GameAction.prev(GS);
    }
    else if (querystr.startsWith(">")) {
	GameAction.next(GS);
    }
    else if (querystr.length>0) {
	GS.query = querystr;
	GameAction.tryaction(GS);
    } else {
	document.getElementById("maintextarea").value = GS.query
	GameAction.tryaction(GS);
    }
}
document.getElementById("maintextarea").onkeypress = function(e) {
    if (e.keyCode == 13) { // enter key
	runCurrentQuery()
	return false;
    }
};

popTasks();
newWall(GS);
document.getElementById("maintextarea").focus()

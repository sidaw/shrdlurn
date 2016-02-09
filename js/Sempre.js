// module Sempre
function cleanValue(valuestring) {
    if (!valuestring) return '';
    return valuestring
        .replace(/edu.stanford.nlp.sempre.cubeworld.CubeWorld./g,'')
	.replace(/edu.stanford.nlp.sempre./g,'')
	.toLowerCase();
}

var formatFormula =  function(formula) {
    if (typeof formula == 'undefined') return ''
    var head = formula[0];
    var str = '';
    if (typeof formula == 'string')
	return cleanValue(formula);
    if (head == 'call') {
	var op = formatFormula(formula[1])

	if (op == '.concat') {
	    str = formatFormula(formula[2]) + ' ' +
		 formatFormula(formula[3]);
	}
	else if (op == '.tostring') {
	    str = formatFormula(formula[2]);
	}
	// Default behavior just exposes the function call
	else {
	    var arglist = []
	    for (var i=2; i<formula.length; i++) {
		arglist.push(formatFormula(formula[i]));
	    }
	    str = op + '(' + arglist.join(',') + ')';
	}
    }
    else if (head == 'number') {
	str = formula[1];
    }
    else if (head == 'name') {
	str = cleanValue(formula[1]);
    }
    else if (head == 'string') {
	str = cleanValue(formula[1]);
    }
    else {
	str = cleanValue(formula[0]);
    }
    return str
}

var formatValue = function(value, listlen) {
    if (typeof value == 'undefined') return ''
    var head = value[0];
    var str = '';
    if (head == 'list') {
	var elements = []
	for (var i=1; i<value.length; i++) {
	    elements.push(formatValue(value[i], value.length));
	}
	str = '[' + elements.join(', ') +']'
    }
    else if (head == 'table') {
	headers = value[1];
	for(var j=0; j<headers.length; j++) {
	    str += value[1][j] + '\t '; // the header
	}
	str += '\n';
	for (var i=2; i<value.length; i++) {
	    for(j=0; j<headers.length; j++) {
		str += formatValue(value[i][j], value.length) + '\t ';
	    }
	    str += '\n';
	}
    }
    else if (head == 'number') {
	str = cleanValue(value[1]);
    }
    else if (head == 'name') {
	str = cleanValue(value[1]);
    }
    else {
	str = cleanValue(value[1]);
    }   
    return str
}

var parseSEMPRE = function (jsontext) {
    var jsresp = JSON.parse(jsontext)['candidates'];
    // filter BADJAVA
    var valid = jsresp.filter(function (v) {return v['value'][0]!='error' && v['value'].length!=1})
    //console.log(valid)
    var lstqapairs = [];
    if(valid.length == 0) return undefined;
    
    for (var i=0; i<valid.length; i++) {
	var qapair = new Object();
	qapair.value = formatValue(valid[i]['value']);
	qapair.formula = formatFormula(valid[i]['formula']);
	qapair.raw = valid[i];
	qapair.rank = i;
	qapair.score = valid[i].score.toFixed(2);
	qapair.prob = valid[i].prob.toFixed(2);
	lstqapairs.push(qapair);
    }
    // console.log(lstqapairs)
    // deduplicate by the formula, from the end
    // assuming scores are sorted in descending order
    var dictqa = {};
    for (var i=lstqapairs.length-1; i>=0; i--) {
	dictqa[lstqapairs[i].formula] = lstqapairs[i];
    }
    listqadedup = []
    for (var key in dictqa) {
	listqadedup.push(dictqa[key])
    }
    listqadedup.sort(function(a,b){return a.rank - b.rank});
    // var enough_score = function (v) {return v.raw.score > 0};
    // start of formatting hacks
    formula_value = listqadedup
    
    return formula_value;   
}

var sempreFormat = function (ques) {
    return ques.replace(/\+/g, ' __+ ').replace(/\(/g, ' [ ').replace(/\)/g, ' ] ')
	.replace(/\+/g, ' + ').replace(/-/g, ' - ').replace(/\*/g, ' * ').replace(/\//g, ' / ')
}

var semprequery = function(query, callback) {
    var pquery = sempreFormat(query);
    var xmlhttp = new XMLHttpRequest();
    var url = 'http://localhost:8400/sempre?format=lisp2json&q='+pquery
    console.log(url)
    xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
	};
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();	
}

var semprequery = function(query, callback) {
    var pquery = sempreFormat(query);
    //var xmlhttp = new XMLHttpRequest();
    var url = 'http://localhost:8400/sempre?format=lisp2json&q='+pquery
    console.log(url)
    xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
	};
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();	
}

var semprecommand = function(cmd) {
    var url = 'http://localhost:8400/sempre?format=lisp2json&q='+G.currentQuery + '&accept='+cmd
    console.log(url)
    xmlhttp.open("GET", url, true);
    xmlhttp.send();	
}


function logh(strlog) {document.getElementById("history").innerHTML += strlog + "; " }

function updateCanvas(strwalls) {
    var PSMain = PS.Main;
    var transformedwall = '[' + G.originalWall + ',' + G.originalWall + ']';
    console.log(strwalls)
    
    if ( strwalls && strwalls.length > 0)
    {
	var isAction = strwalls.indexOf('true') == -1 && strwalls.indexOf('false')==-1 //hack!
	if (isAction)
	    transformedwall = '[ ' + G.originalWall + ',' + strwalls +' ]'
    }
    PSMain.renderJSON(transformedwall)()
}

String.prototype._format = function(placeholders) {
    var s = this;
    for(var propertyName in placeholders) {
	console.log(propertyName)
        var re = new RegExp('{' + propertyName + '}', 'gm');
        s = s.replace(re, placeholders[propertyName]);
    }    
    return s;
};

function doSempreAction(jsonstr) {
    var formval = parseSEMPRE(jsonstr);
    if (formval == undefined) {
	console.log('undefined answer from sempre')
	return
    }
    G.semAnsInd = 0;
    G.semAns = formval;
    document.getElementById("sempreret").innerHTML = ''
    for (i in formval)
	document.getElementById("sempreret").innerHTML +=
    '(prob={prob},score={score}): {formula}'._format(formval[i]) +
     '<br/>';
    
    var strwalls = formval[G.semAnsInd].value;
    updateCanvas(strwalls)
}

function showNext() {
    if (G.semAnsInd < G.semAns.length )
	updateCanvas(G.semAns[++G.semAnsInd].value)
}

function runCurrentQuery() {
    querystr = document.getElementById("maintextarea").value
    document.getElementById("maintextarea").value = ''

    logh('  ' + querystr)
    
    if (querystr.startsWith(":|")) {
	newWall()
    }
    else if (querystr.startsWith(":)")) {
	semprecommand(G.semAnsInd)
	showNext()
    }
    else if (querystr.startsWith(":(")) {
	showNext()
    }
    else {
	G.currentQuery = 'parse ' + querystr
	semprequery(G.currentQuery , doSempreAction)
    }
}

function newWall() {
    querystr = "_newInitialWall" // attach arguments here!
    semprequery(querystr, function (jsonstr) {
	var formval = parseSEMPRE(jsonstr);
	G.originalWall = formval[0].value;
	updateCanvas()
    })
}

var G = {}
G.originalWall = "";
G.semAns = {};
G.semAnsInd = 0;
G.currentQuery = "";
var xmlhttp = new XMLHttpRequest();

document.getElementById("enterbutton").onclick = function() {
    runCurrentQuery()
};

document.getElementById("newwallbutton").onclick = function() {
    newWall()
};
document.getElementById("happybutton").onclick = function() {
    semprecommand(G.semAnsInd)
    showNext()
};
document.getElementById("sadbutton").onclick = function() {
    showNext()
};


document.getElementById("maintextarea").onkeypress = function(e) {
    if (e.keyCode == 13) {
	runCurrentQuery();
	return false;
    }
};

newWall();
document.getElementById("maintextarea").focus()

// module Sempre
function cleanValue(valuestring) {
    return valuestring.replace(/fb:en./g, '')
        .replace(/edu.stanford.nlp.sempre.overnight.CubeWorld./g,'')
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
    if(valid.length == 0) return 'too many answers...';
    
    for (var i=0; i<valid.length; i++) {
	var qapair = new Object();
	qapair.value = formatValue(valid[i]['value']);
	qapair.formula = formatFormula(valid[i]['formula']);
	qapair.raw = valid[i];
	qapair.rank = i;
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
            displayValue(xmlhttp.responseText);
	};
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();	
}

function displayValue(strval) {
    var formval = parseSEMPRE(strval);
    document.getElementById("sempreret").innerHTML = formval[0].formula + ": " + formval[0].value;
    var PSMain = PS.Main;
    PSMain.renderJSON(formval[0].value)()
}

function runCurrentQuery() {
    querystr = document.getElementById("maintextarea").value
    document.getElementById("maintextarea").value = ''
    document.getElementById("history").innerHTML += "<br/>" + querystr 
    semprequery(querystr, displayValue)
}

document.getElementById("enterbutton").onclick = function() {
    runCurrentQuery()
};

document.getElementById("maintextarea").onkeypress = function(e) {
    if (e.keyCode == 13) {
	runCurrentQuery();
	return false;
    }
};

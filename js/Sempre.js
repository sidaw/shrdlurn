"use strict"
var SEMPRE_URL = "http://localhost:8400"
var sempre = {
    cleanValue: function (valuestring) {
	if (!valuestring) return '';
	return valuestring
            .replace(/edu.stanford.nlp.sempre.cubeworld.CubeWorld./g,'')
	    .replace(/edu.stanford.nlp.sempre./g,'')
	    .toLowerCase();
    },
    
    formatFormula: function(formula) {
	var cleanValue = this.cleanValue;
	if (typeof formula == 'undefined') return ''
	var head = formula[0];
	var str = '';
	if (typeof formula == 'string')
	    return cleanValue(formula);
	if (head == 'call') {
	    var op = this.formatFormula(formula[1])

	    if (op == '.concat') {
		str = this.formatFormula(formula[2]) + ' ' +
		    this.formatFormula(formula[3]);
	    }
	    else if (op == '.tostring') {
		str =this. formatFormula(formula[2]);
	    }
	    // Default behavior just exposes the function call
	    else {
		var arglist = []
		for (var i=2; i<formula.length; i++) {
		    arglist.push(this.formatFormula(formula[i]));
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
    },

    formatValue: function(value, listlen) {
	var cleanValue = this.cleanValue;
	if (typeof value == 'undefined') return ''
	var head = value[0];
	var str = '';
	if (head == 'list') {
	    var elements = []
	    for (var i=1; i<value.length; i++) {
		elements.push(this.formatValue(value[i], value.length));
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
		    str += this.formatValue(value[i][j], value.length) + '\t ';
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
    },

    parseSEMPRE: function (jsontext) {
	var jsresp = JSON.parse(jsontext)['candidates'];
	// filter BADJAVA
	var valid = jsresp.filter(function (v) {return v['value'][0]!='error' && v['value'].length!=1})
	//console.log(valid)
	var lstqapairs = [];
	if(valid.length == 0) return undefined;
	
	for (var i=0; i<valid.length; i++) {
	    var qapair = new Object();
	    qapair.value = this.formatValue(valid[i]['value']);
	    qapair.formula = this.formatFormula(valid[i]['formula']);
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
    },

    sempreFormat: function (ques) {
	return ques.replace(/\+/g, ' __+ ').replace(/\(/g, ' [ ').replace(/\)/g, ' ] ')
	    .replace(/\+/g, ' + ').replace(/-/g, ' - ').replace(/\*/g, ' * ').replace(/\//g, ' / ')
    },

    sempreQuery: function(cmds, callback) {
	var xmlhttp = new XMLHttpRequest();
	var cmdstr = [];
	for (k in cmds) {
	    cmdstr.push(k + '=' + encodeURIComponent(cmds[k]));
	}
	var url = SEMPRE_URL + '/sempre?format=lisp2json&'+cmdstr.join('&');
	console.log(url)
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
		callback(xmlhttp.responseText);
	    };
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();	
    }
}


"use strict"
var sempre = {
    cleanValue: function (valuestring) {
	if (!valuestring) return '';
	return valuestring
	    .replace(/edu.stanford.nlp.sempre.cubeworld.CubeWorld./g,'')
            .replace(/edu.stanford.nlp.sempre.cubeworld..*\./g,'')
	    .replace(/edu.stanford.nlp.sempre./g,'')
	    .replace(/context:root/g,'')
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
		str = this. formatFormula(formula[2]);
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
	var valid = JSON.parse(jsontext)['candidates'];
	// filter BADJAVA
	// var valid = jsresp.filter(function (v) {return v['value'][0]!='error' && v['value'].length!=1})
	//console.log(valid)
	var lstqapairs = [];
	if(valid.length == 0) return undefined;
	
	for (var i=0; i<valid.length; i++) {
	    var qapair = {};
	    qapair.value = this.formatValue(valid[i]['value']);
	    qapair.formula = this.formatFormula(valid[i]['formula']);
	    //qapair.raw = valid[i];
	    qapair.score = valid[i].score.toFixed(7);
	    qapair.rank = i;
	    qapair.prob = valid[i].prob;
	    qapair.pprob = valid[i].pprob;
	    lstqapairs.push(qapair);
	}

	function combine(vs, v) {
	    if (vs == undefined) {
		vs = {};
		vs.value = v.value;
		vs.formula = v.formula;
		vs.formulas = [vs.formula]
		vs.prob = parseFloat(v.prob);
		vs.probs = [v.prob];
		vs.pprob = parseFloat(v.pprob);
		vs.pprobs = [v.pprob];
		vs.score = parseFloat(v.score);
		vs.rank = v.rank;
		vs.count = 1;
		vs.maxprob = parseFloat(v.prob);
		vs.maxpprob = parseFloat(v.pprob);
	    } else {
		vs.value = v.value;
		vs.prob += parseFloat(v.prob);
		vs.pprob += parseFloat(v.pprob);
		
		vs.score = Math.max(vs.score, parseFloat(v.score));
		vs.maxprob = Math.max(vs.maxprob, parseFloat(v.prob));
		vs.maxpprob = Math.max(vs.maxpprob, parseFloat(v.pprob));
		vs.rank = Math.min(vs.rank, v.rank);
		vs.probs.push(v.prob);
		vs.formulas.push(v.formula)
		vs.count += 1;
	    }
	    return vs;
	}
	var nbestdict = lstqapairs.reduce(function(nbd, nbest) {
	    nbd[nbest.value] = combine(nbd[nbest.value], nbest);
	    return nbd;
	}, {});
	var listqadedup = []
	for (var key in nbestdict) {
	     listqadedup.push(nbestdict[key])
	}
	listqadedup.sort(function(a,b){return b.score - a.score + 1e-3*(a.rank - b.rank)});
	return listqadedup; 
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
	var url = configs.SEMPRE_URL + '/sempre?format=lisp2json&'+cmdstr.join('&');
	console.log(url)
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
		callback(xmlhttp.responseText);
	    } else {
		console.log("xmlhttp issue?")
	    }
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send(null);	
    }
}


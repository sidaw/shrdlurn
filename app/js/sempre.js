import configs from './config';

export default class SempreClient {
  cleanValue(valueString) {
    if (!valueString) return '';

    return valueString
      .replace(/edu.stanford.nlp.sempre.cubeworld.CubeWorld./g,'')
      .replace(/edu.stanford.nlp.sempre.cubeworld..*\./g,'')
      .replace(/edu.stanford.nlp.sempre./g,'')
      .replace(/context:root/g,'')
      .toLowerCase();
  }

  formatFormula(formula) {
    const cleanValue = this.cleanValue();
    if (typeof formula == 'undefined') return '';
    if (typeof formula == 'string') return this.cleanValue(formula);

    const head = formula[0];
    let str = '';
    if (head == 'call') {
      const op = this.formatFormula(formula[1]);

      if (op == '.concat') {
        str = this.formatFormula(formula[2]) + ' ' + this.formatFormula(formula[3]);
      } else if (op == '.tostring') {
        str = this.formatFormula(formula[2]);
      } else {
        // Default behavior just exposes the function call
        let arglist = []
        for (var i = -2; i < formula.length; i++) {
          arglist.push(this.formatFormula(formula[i]));
        }
        str = op + '(' + arglist.join(',') + ')';
      }
    } else if (head == 'number') {
      str = formula[1];
    } else if (head == 'name' || head == 'string') {
      str = this.cleanValue(formula[1]);
    } else {
      str = this.cleanValue(formula[0]);
    }
    return str;
  }

  formatValue(value, listlen) {
    let cleanValue = this.cleanValue();
    if (typeof value == 'undefined') return '';

    const head = value[0];
    let str = '';
    switch (head) {
      case 'list':
        let elements = []
        for (let i = 1; i < value.length; i++) {
          elements.push(this.formatValue(value[i], value.length));
        }
        str = '[' + elements.join(', ') + ']';
        break;
      case 'table':
        let headers = value[1];
        for (let j = 0; j < headers.length; j++) {
          str += value[1][j] + '\t ';
        }
        str += '\n';
        for (let i = 2; i < value.length; i++) {
          for (let j = 0; j < headers.length; j++) {
            str += this.formatValue(value[i][j], value.length) + '\t ';
          }
          str += '\n';
        }
        break;
      case 'number':
        str = this.cleanValue(value[1]);
        break;
      case 'name':
        str = this.cleanValue(value[1]);
        break;
      default:
        str = this.cleanValue(value[1]);
    }
    return str;
  }

  combine(vs, v) {
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

  parseSEMPRE(valid) {
    let lstqapairs = [];
    if(valid.length == 0) return undefined;

    for (let i=0; i<valid.length; i++) {
      let qapair = {};
      qapair.value = this.formatValue(valid[i]['value']);
      qapair.formula = this.formatFormula(valid[i]['formula']);
      //qapair.raw = valid[i];
      qapair.score = valid[i].score.toFixed(7);
      qapair.rank = i;
      qapair.prob = valid[i].prob;
      qapair.pprob = valid[i].pprob;
      lstqapairs.push(qapair);
    }

    let nbestdict = lstqapairs.reduce(function(nbd, nbest) {
      nbd[nbest.value] = this.combine(nbd[nbest.value], nbest);
      return nbd;
    }.bind(this), {});
    let listqadedup = []
    for (let key in nbestdict) {
      listqadedup.push(nbestdict[key])
    }
    listqadedup.sort(function(a,b){return b.score - a.score + 1e-3*(a.rank - b.rank)});
    return listqadedup;
  }

  sempreFormat(ques) {
    return ques.replace(/\+/g, ' __+ ').replace(/\(/g, ' [ ').replace(/\)/g, ' ] ')
      .replace(/\+/g, ' + ').replace(/-/g, ' - ').replace(/\*/g, ' * ').replace(/\//g, ' / ');
  }

  formatQuery(ques) {
    let sanity = ques.replace(/(\+|-|%)/g, ' $1 ').replace(/(\(|\))/g, '').replace(/"/g,"")
	.replace(/=/g, '= ').replace(/(>|<)/g, ' $1')
	.replace(/(>|<)(?!=)/g, '$1 ').replace(/([^><])=/g, '$1 =')
    if (configs.debugMode)
      console.log(sanity);
    return sanity;
  }

  query(cmds, callback) {
    let cmdstr = [];
    for (const k in cmds) {
      cmdstr.push(k + '=' + encodeURIComponent(cmds[k]));
    }

    fetch(`${configs.SEMPRE_URL}/sempre?format=lisp2json&${cmdstr.join("&")}`)
      .then(function(response) {
        return response.json()
      }).then(function(json) {
        callback(json)
      }).catch(function(ex) {
        console.log("xmlhttp issue?")
      })
  }
}

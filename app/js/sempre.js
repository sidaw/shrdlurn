import configs from "./config";

export default class SempreClient {
  cleanValue(valueString) {
    if (!valueString) return "";

    return valueString
      .replace(/edu.stanford.nlp.sempre.cubeworld.CubeWorld./g, "")
      .replace(/edu.stanford.nlp.sempre.cubeworld..*\./g, "")
      .replace(/edu.stanford.nlp.sempre./g, "")
      .replace(/context:root/g, "")
      .toLowerCase();
  }

  formatFormula(formula) {
    if (typeof formula === "undefined") return "";
    if (typeof formula === "string") return this.cleanValue(formula);

    const head = formula[0];
    let str = "";
    if (head === "call") {
      const op = this.formatFormula(formula[1]);

      if (op === ".concat") {
        str = `${this.formatFormula(formula[2])} ${this.formatFormula(formula[3])}`;
      } else if (op === ".tostring") {
        str = this.formatFormula(formula[2]);
      } else {
        // Default behavior just exposes the function call
        const arglist = [];
        for (let i = -2; i < formula.length; i++) {
          arglist.push(this.formatFormula(formula[i]));
        }
        str = `${op}(${arglist.join(",")})`;
      }
    } else if (head === "number") {
      str = formula[1];
    } else if (head === "name" || head === "string") {
      str = this.cleanValue(formula[1]);
    } else {
      str = this.cleanValue(formula[0]);
    }
    return str;
  }

  formatValue(value) {
    if (typeof value === "undefined") return "";
    // "[[5,5,1,\"Blue\",[]],[5,5,2,\"Red\",[]],[5,4,2,\"Green\",[]]]"
    const valueArray = JSON.parse(value);

    // const valueArray = [[1, 1, 0, "Red", []], [1, 1, 1, "Orange", []]];

    return valueArray.map((c) => (
      {
        x: c[0],
        y: c[1],
        z: c[2],
        color: c[3],
        names: c[4],
      }
    ));

    // const head = value[0];
    // let str = "";
    // switch (head) {
    //   case "list": {
    //     const elements = [];
    //     for (let i = 1; i < value.length; i++) {
    //       elements.push(this.formatValue(value[i], value.length));
    //     }
    //     str = `[${elements.join(", ")}]`;
    //     break;
    //   }
    //   case "table": {
    //     const headers = value[1];
    //     for (let j = 0; j < headers.length; j++) {
    //       str += `{${value[1][j]}\t `;
    //     }
    //     str += "\n";
    //     for (let i = 2; i < value.length; i++) {
    //       for (let j = 0; j < headers.length; j++) {
    //         str += `${this.formatValue(value[i][j], value.length)}\t `;
    //       }
    //       str += "\n";
    //     }
    //     break;
    //   }
    //   case "number": {
    //     str = this.cleanValue(value[1]);
    //     break;
    //   }
    //   case "name": {
    //     str = this.cleanValue(value[1]);
    //     break;
    //   }
    //   default: {
    //     str = this.cleanValue(value[1]);
    //   }
    // }
    // return str;
  }

  combine(vsTmp, v) {
    let vs = vsTmp;
    if (vs === undefined) {
      vs = {};
      vs.value = v.value;
      vs.formula = v.formula;
      vs.formulas = [vs.formula];
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
      vs.formulas.push(v.formula);
      vs.count += 1;
    }
    return vs;
  }

  parseSEMPRE(valid) {
    const lstqapairs = [];
    if (valid.length === 0) return undefined;

    for (let i = 0; i < valid.length; i++) {
      const qapair = {};
      qapair.value = this.formatValue(valid[i].value);
      qapair.formula = valid[i].formula;
      qapair.score = valid[i].score.toFixed(7);
      qapair.rank = i;
      qapair.prob = valid[i].prob;
      qapair.pprob = valid[i].pprob;
      lstqapairs.push(qapair);
    }

    const nbestdict = lstqapairs.reduce((nbd, nbest) => {
      const mynbd = nbd;
      const key = JSON.stringify(nbest.value);
      mynbd[key] = this.combine(nbd[key], nbest);
      return mynbd;
    }, {});

    const listqadedup = [];
    for (const key in nbestdict) {
      listqadedup.push(nbestdict[key]);
    }
    listqadedup.sort((a, b) => b.score - a.score + 1e-3 * (a.rank - b.rank));
    return listqadedup;
  }

  sempreFormat(ques) {
    return ques.replace(/\+/g, " __+ ")
               .replace(/\(/g, " [ ")
               .replace(/\)/g, " ] ")
               .replace(/\+/g, " + ")
               .replace(/-/g, " - ")
               .replace(/\*/g, " * ")
               .replace(/\//g, " / ");
  }

  formatQuery(ques) {
    const sanity = ques.replace(/(\+|-|%|;)/g, " $1 ")
                       .replace(/(\(|\))/g, "") // disables commands
                       .replace(/"/g, "")
                       .replace(/=/g, "= ")
                       .replace(/(>|<)/g, " $1")
                       .replace(/(>|<)(?!=)/g, "$1 ")
                       .replace(/([^><])=/g, "$1 =");
    if (configs.debugMode) {
      console.log(sanity);
    }
    return sanity;
  }

  query(cmds, callback) {
    const cmdstr = [];
    for (const k in cmds) {
      cmdstr.push(`${k}=${encodeURIComponent(cmds[k])}`);
    }

    fetch(`${configs.SEMPRE_URL}/sempre?format=lisp2json&${cmdstr.join("&")}`)
      .then((response) => response.json())
      .then((json) => callback(json))
      // .catch((ex) => {
      //   console.log("xmlhttp issue?", ex);
      // });
  }
}

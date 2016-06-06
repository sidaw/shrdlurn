/*! Isomer v0.2.5 | (c) 2014 Jordan Scales | jdan.github.io/isomer/license.txt */
!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):"object"==typeof exports?exports.Isomer=n():t.Isomer=n()}(this,function(){return function(t){function n(r){if(e[r])return e[r].exports;var o=e[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){t.exports=e(5)},function(t,n,e){function r(t,n,e){return this instanceof r?(this.x="number"==typeof t?t:0,this.y="number"==typeof n?n:0,this.z="number"==typeof e?e:0,void 0):new r(t,n,e)}r.ORIGIN=new r(0,0,0),r.prototype.translate=function(t,n,e){return new r(this.x+t,this.y+n,this.z+e)},r.prototype.scale=function(t,n,e,r){var o=this.translate(-t.x,-t.y,-t.z);return void 0===e&&void 0===r?e=r=n:r="number"==typeof r?r:1,o.x*=n,o.y*=e,o.z*=r,o.translate(t.x,t.y,t.z)},r.prototype.rotateX=function(t,n){var e=this.translate(-t.x,-t.y,-t.z),r=e.z*Math.cos(n)-e.y*Math.sin(n),o=e.z*Math.sin(n)+e.y*Math.cos(n);return e.z=r,e.y=o,e.translate(t.x,t.y,t.z)},r.prototype.rotateY=function(t,n){var e=this.translate(-t.x,-t.y,-t.z),r=e.x*Math.cos(n)-e.z*Math.sin(n),o=e.x*Math.sin(n)+e.z*Math.cos(n);return e.x=r,e.z=o,e.translate(t.x,t.y,t.z)},r.prototype.rotateZ=function(t,n){var e=this.translate(-t.x,-t.y,-t.z),r=e.x*Math.cos(n)-e.y*Math.sin(n),o=e.x*Math.sin(n)+e.y*Math.cos(n);return e.x=r,e.y=o,e.translate(t.x,t.y,t.z)},r.prototype.depth=function(){return this.x+this.y-2*this.z},r.distance=function(t,n){var e=n.x-t.x,r=n.y-t.y,o=n.z-t.z;return Math.sqrt(e*e+r*r+o*o)},t.exports=r},function(t,n,e){function r(t){this.points="[object Array]"===Object.prototype.toString.call(t)?t:Array.prototype.slice.call(arguments)}var o=e(1);r.prototype.push=function(t){this.points.push(t)},r.prototype.reverse=function(){var t=Array.prototype.slice.call(this.points);return new r(t.reverse())},r.prototype.translate=function(){var t=arguments;return new r(this.points.map(function(n){return n.translate.apply(n,t)}))},r.prototype.rotateX=function(){var t=arguments;return new r(this.points.map(function(n){return n.rotateX.apply(n,t)}))},r.prototype.rotateY=function(){var t=arguments;return new r(this.points.map(function(n){return n.rotateY.apply(n,t)}))},r.prototype.rotateZ=function(){var t=arguments;return new r(this.points.map(function(n){return n.rotateZ.apply(n,t)}))},r.prototype.scale=function(){var t=arguments;return new r(this.points.map(function(n){return n.scale.apply(n,t)}))},r.prototype.depth=function(){var t,n=0;for(t=0;t<this.points.length;t++)n+=this.points[t].depth();return n/(this.points.length||1)},r.Rectangle=function(t,n,e){void 0===n&&(n=1),void 0===e&&(e=1);var i=new r([t,new o(t.x+n,t.y,t.z),new o(t.x+n,t.y+e,t.z),new o(t.x,t.y+e,t.z)]);return i},r.Circle=function(t,n,e){e=e||20;var i,s=new r;for(i=0;e>i;i++)s.push(new o(n*Math.cos(2*i*Math.PI/e),n*Math.sin(2*i*Math.PI/e),0));return s.translate(t.x,t.y,t.z)},r.Star=function(t,n,e,i){var s,a,h=new r;for(s=0;2*i>s;s++)a=s%2===0?n:e,h.push(new o(a*Math.cos(s*Math.PI/i),a*Math.sin(s*Math.PI/i),0));return h.translate(t.x,t.y,t.z)},t.exports=r},function(t,n,e){function r(t){this.elem=t,this.ctx=this.elem.getContext("2d"),this.width=t.width,this.height=t.height}r.prototype.clear=function(){this.ctx.clearRect(0,0,this.width,this.height)},r.prototype.path=function(t,n){this.ctx.beginPath(),this.ctx.moveTo(t[0].x,t[0].y);for(var e=1;e<t.length;e++)this.ctx.lineTo(t[e].x,t[e].y);this.ctx.closePath(),this.ctx.save(),this.ctx.globalAlpha=n.a,this.ctx.fillStyle=this.ctx.strokeStyle=n.toHex(),this.ctx.stroke(),this.ctx.fill(),this.ctx.restore()},t.exports=r},function(t,n,e){function r(t,n,e,r){this.r=parseInt(t||0),this.g=parseInt(n||0),this.b=parseInt(e||0),this.a=parseFloat(Math.round(100*r)/100||1),this.loadHSL()}r.prototype.toHex=function(){var t=(256*this.r*256+256*this.g+this.b).toString(16);return t.length<6&&(t=new Array(6-t.length+1).join("0")+t),"#"+t},r.prototype.lighten=function(t,n){n=n||new r(255,255,255);var e=new r(n.r/255*this.r,n.g/255*this.g,n.b/255*this.b,this.a);return e.l=Math.min(e.l+t,1),e.loadRGB(),e},r.prototype.loadHSL=function(){var t,n,e=this.r/255,r=this.g/255,o=this.b/255,i=Math.max(e,r,o),s=Math.min(e,r,o),a=(i+s)/2;if(i===s)t=n=0;else{var h=i-s;switch(n=a>.5?h/(2-i-s):h/(i+s),i){case e:t=(r-o)/h+(o>r?6:0);break;case r:t=(o-e)/h+2;break;case o:t=(e-r)/h+4}t/=6}this.h=t,this.s=n,this.l=a},r.prototype.loadRGB=function(){var t,n,e,r=this.h,o=this.s,i=this.l;if(0===o)t=n=e=i;else{var s=.5>i?i*(1+o):i+o-i*o,a=2*i-s;t=this._hue2rgb(a,s,r+1/3),n=this._hue2rgb(a,s,r),e=this._hue2rgb(a,s,r-1/3)}this.r=parseInt(255*t),this.g=parseInt(255*n),this.b=parseInt(255*e)},r.prototype._hue2rgb=function(t,n,e){return 0>e&&(e+=1),e>1&&(e-=1),1/6>e?t+6*(n-t)*e:.5>e?n:2/3>e?t+(n-t)*(2/3-e)*6:t},t.exports=r},function(t,n,e){function r(t,n){n=n||{},this.canvas=new o(t),this.angle=Math.PI/6,this.scale=n.scale||70,this._calculateTransformation(),this.originX=n.originX||this.canvas.width/2,this.originY=n.originY||.9*this.canvas.height,this.lightPosition=n.lightPosition||new p(2,-1,3),this.lightAngle=this.lightPosition.normalize(),this.colorDifference=.2,this.lightColor=n.lightColor||new i(255,255,255)}var o=e(3),i=e(4),s=e(2),a=e(1),h=e(6),p=e(7);r.prototype.setLightPosition=function(t,n,e){this.lightPosition=new p(t,n,e),this.lightAngle=this.lightPosition.normalize()},r.prototype._translatePoint=function(t){var n=new a(t.x*this.transformation[0][0],t.x*this.transformation[0][1]),e=new a(t.y*this.transformation[1][0],t.y*this.transformation[1][1]),r=this.originX+n.x+e.x,o=this.originY-n.y-e.y-t.z*this.scale;return new a(r,o)},r.prototype.add=function(t,n){if("[object Array]"==Object.prototype.toString.call(t))for(var e=0;e<t.length;e++)this.add(t[e],n);else if(t instanceof s)this._addPath(t,n);else if(t instanceof h)for(var r=t.orderedPaths(),o=0;o<r.length;o++)this._addPath(r[o],n)},r.prototype._addPath=function(t,n){n=n||new i(120,120,120);var e=p.fromTwoPoints(t.points[1],t.points[0]),r=p.fromTwoPoints(t.points[2],t.points[1]),o=p.crossProduct(e,r).normalize(),s=p.dotProduct(o,this.lightAngle),a=n.lighten(s*this.colorDifference,this.lightColor);this.canvas.path(t.points.map(this._translatePoint.bind(this)),a)},r.prototype._calculateTransformation=function(){this.transformation=[[this.scale*Math.cos(this.angle),this.scale*Math.sin(this.angle)],[this.scale*Math.cos(Math.PI-this.angle),this.scale*Math.sin(Math.PI-this.angle)]]},r.Canvas=o,r.Color=i,r.Path=s,r.Point=a,r.Shape=h,r.Vector=p,t.exports=r},function(t,n,e){function r(t){this.paths="[object Array]"===Object.prototype.toString.call(t)?t:Array.prototype.slice.call(arguments)}var o=e(2),i=e(1);r.prototype.push=function(t){this.paths.push(t)},r.prototype.translate=function(){var t=arguments;return new r(this.paths.map(function(n){return n.translate.apply(n,t)}))},r.prototype.rotateX=function(){var t=arguments;return new r(this.paths.map(function(n){return n.rotateX.apply(n,t)}))},r.prototype.rotateY=function(){var t=arguments;return new r(this.paths.map(function(n){return n.rotateY.apply(n,t)}))},r.prototype.rotateZ=function(){var t=arguments;return new r(this.paths.map(function(n){return n.rotateZ.apply(n,t)}))},r.prototype.scale=function(){var t=arguments;return new r(this.paths.map(function(n){return n.scale.apply(n,t)}))},r.prototype.orderedPaths=function(){var t=this.paths.slice();return t.sort(function(t,n){return n.depth()-t.depth()})},r.extrude=function(t,n){n="number"==typeof n?n:1;var e,i=t.translate(0,0,n),s=new r;for(s.push(t.reverse()),s.push(i),e=0;e<t.points.length;e++)s.push(new o([i.points[e],t.points[e],t.points[(e+1)%t.points.length],i.points[(e+1)%i.points.length]]));return s},r.Prism=function(t,n,e,s){n="number"==typeof n?n:1,e="number"==typeof e?e:1,s="number"==typeof s?s:1;var a=new r,h=new o([t,new i(t.x+n,t.y,t.z),new i(t.x+n,t.y,t.z+s),new i(t.x,t.y,t.z+s)]);a.push(h),a.push(h.reverse().translate(0,e,0));var p=new o([t,new i(t.x,t.y,t.z+s),new i(t.x,t.y+e,t.z+s),new i(t.x,t.y+e,t.z)]);a.push(p),a.push(p.reverse().translate(n,0,0));var u=new o([t,new i(t.x+n,t.y,t.z),new i(t.x+n,t.y+e,t.z),new i(t.x,t.y+e,t.z)]);return a.push(u.reverse()),a.push(u.translate(0,0,s)),a},r.Pyramid=function(t,n,e,s){n="number"==typeof n?n:1,e="number"==typeof e?e:1,s="number"==typeof s?s:1;var a=new r,h=new o([t,new i(t.x+n,t.y,t.z),new i(t.x+n/2,t.y+e/2,t.z+s)]);a.push(h),a.push(h.rotateZ(t.translate(n/2,e/2),Math.PI));var p=new o([t,new i(t.x+n/2,t.y+e/2,t.z+s),new i(t.x,t.y+e,t.z)]);return a.push(p),a.push(p.rotateZ(t.translate(n/2,e/2),Math.PI)),a},r.Cylinder=function(t,n,e,i){n="number"==typeof n?n:1;var s=o.Circle(t,n,e),a=r.extrude(s,i);return a},t.exports=r},function(t,n,e){function r(t,n,e){this.i="number"==typeof t?t:0,this.j="number"==typeof n?n:0,this.k="number"==typeof e?e:0}r.fromTwoPoints=function(t,n){return new r(n.x-t.x,n.y-t.y,n.z-t.z)},r.crossProduct=function(t,n){var e=t.j*n.k-n.j*t.k,o=-1*(t.i*n.k-n.i*t.k),i=t.i*n.j-n.i*t.j;return new r(e,o,i)},r.dotProduct=function(t,n){return t.i*n.i+t.j*n.j+t.k*n.k},r.prototype.magnitude=function(){return Math.sqrt(this.i*this.i+this.j*this.j+this.k*this.k)},r.prototype.normalize=function(){var t=this.magnitude();return 0===t?new r(0,0,0):new r(this.i/t,this.j/t,this.k/t)},t.exports=r}])});
// Generated by psc-bundle 0.7.6.1
var PS = { };
(function(exports) {
  /* global exports */
  "use strict";

  // module Prelude

  //- Functor --------------------------------------------------------------------

  exports.arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };

  //- Eq -------------------------------------------------------------------------

  exports.refEq = function (r1) {
    return function (r2) {
      return r1 === r2;
    };
  };                                          

  //- BooleanAlgebra -------------------------------------------------------------

  exports.boolOr = function (b1) {
    return function (b2) {
      return b1 || b2;
    };
  };

  exports.boolAnd = function (b1) {
    return function (b2) {
      return b1 && b2;
    };
  };

  exports.boolNot = function (b) {
    return !b;
  };

  //- Show -----------------------------------------------------------------------

  exports.showIntImpl = function (n) {
    return n.toString();
  };

  exports.showArrayImpl = function (f) {
    return function (xs) {
      var ss = [];
      for (var i = 0, l = xs.length; i < l; i++) {
        ss[i] = f(xs[i]);
      }
      return "[" + ss.join(",") + "]";
    };
  };
 
})(PS["Prelude"] = PS["Prelude"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Prelude"];
  var Semigroupoid = function (compose) {
      this.compose = compose;
  };
  var Category = function (__superclass_Prelude$dotSemigroupoid_0, id) {
      this["__superclass_Prelude.Semigroupoid_0"] = __superclass_Prelude$dotSemigroupoid_0;
      this.id = id;
  };
  var Functor = function (map) {
      this.map = map;
  };
  var Apply = function (__superclass_Prelude$dotFunctor_0, apply) {
      this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
      this.apply = apply;
  };
  var Applicative = function (__superclass_Prelude$dotApply_0, pure) {
      this["__superclass_Prelude.Apply_0"] = __superclass_Prelude$dotApply_0;
      this.pure = pure;
  };
  var Bind = function (__superclass_Prelude$dotApply_0, bind) {
      this["__superclass_Prelude.Apply_0"] = __superclass_Prelude$dotApply_0;
      this.bind = bind;
  };
  var Monad = function (__superclass_Prelude$dotApplicative_0, __superclass_Prelude$dotBind_1) {
      this["__superclass_Prelude.Applicative_0"] = __superclass_Prelude$dotApplicative_0;
      this["__superclass_Prelude.Bind_1"] = __superclass_Prelude$dotBind_1;
  };
  var Eq = function (eq) {
      this.eq = eq;
  };
  var Bounded = function (bottom, top) {
      this.bottom = bottom;
      this.top = top;
  };
  var BooleanAlgebra = function (__superclass_Prelude$dotBounded_0, conj, disj, not) {
      this["__superclass_Prelude.Bounded_0"] = __superclass_Prelude$dotBounded_0;
      this.conj = conj;
      this.disj = disj;
      this.not = not;
  };
  var Show = function (show) {
      this.show = show;
  };                                                                           
  var unit = {};
  var top = function (dict) {
      return dict.top;
  };                                                 
  var showInt = new Show($foreign.showIntImpl);
  var show = function (dict) {
      return dict.show;
  };
  var showArray = function (__dict_Show_1) {
      return new Show($foreign.showArrayImpl(show(__dict_Show_1)));
  };                                                                     
  var semigroupoidFn = new Semigroupoid(function (f) {
      return function (g) {
          return function (x) {
              return f(g(x));
          };
      };
  });                 
  var pure = function (dict) {
      return dict.pure;
  };
  var $$return = function (__dict_Applicative_2) {
      return pure(__dict_Applicative_2);
  };
  var otherwise = true;
  var not = function (dict) {
      return dict.not;
  };
  var map = function (dict) {
      return dict.map;
  };
  var $less$dollar$greater = function (__dict_Functor_5) {
      return map(__dict_Functor_5);
  };
  var $less$hash$greater = function (__dict_Functor_6) {
      return function (fa) {
          return function (f) {
              return $less$dollar$greater(__dict_Functor_6)(f)(fa);
          };
      };
  };
  var id = function (dict) {
      return dict.id;
  };
  var functorArray = new Functor($foreign.arrayMap);
  var eqString = new Eq($foreign.refEq);
  var eqInt = new Eq($foreign.refEq);
  var eq = function (dict) {
      return dict.eq;
  };
  var $eq$eq = function (__dict_Eq_7) {
      return eq(__dict_Eq_7);
  };
  var disj = function (dict) {
      return dict.disj;
  };
  var $$const = function (a) {
      return function (_3) {
          return a;
      };
  };
  var conj = function (dict) {
      return dict.conj;
  };
  var compose = function (dict) {
      return dict.compose;
  };
  var categoryFn = new Category(function () {
      return semigroupoidFn;
  }, function (x) {
      return x;
  });
  var boundedBoolean = new Bounded(false, true);
  var bottom = function (dict) {
      return dict.bottom;
  };
  var booleanAlgebraBoolean = new BooleanAlgebra(function () {
      return boundedBoolean;
  }, $foreign.boolAnd, $foreign.boolOr, $foreign.boolNot);
  var $div$eq = function (__dict_Eq_9) {
      return function (x) {
          return function (y) {
              return not(booleanAlgebraBoolean)($eq$eq(__dict_Eq_9)(x)(y));
          };
      };
  };
  var bind = function (dict) {
      return dict.bind;
  };
  var $greater$greater$eq = function (__dict_Bind_24) {
      return bind(__dict_Bind_24);
  }; 
  var apply = function (dict) {
      return dict.apply;
  };
  var $less$times$greater = function (__dict_Apply_25) {
      return apply(__dict_Apply_25);
  };
  var liftA1 = function (__dict_Applicative_26) {
      return function (f) {
          return function (a) {
              return $less$times$greater(__dict_Applicative_26["__superclass_Prelude.Apply_0"]())(pure(__dict_Applicative_26)(f))(a);
          };
      };
  }; 
  var append = function (dict) {
      return dict.append;
  };
  var $less$greater = function (__dict_Semigroup_28) {
      return append(__dict_Semigroup_28);
  };
  var ap = function (__dict_Monad_30) {
      return function (f) {
          return function (a) {
              return bind(__dict_Monad_30["__superclass_Prelude.Bind_1"]())(f)(function (_2) {
                  return bind(__dict_Monad_30["__superclass_Prelude.Bind_1"]())(a)(function (_1) {
                      return $$return(__dict_Monad_30["__superclass_Prelude.Applicative_0"]())(_2(_1));
                  });
              });
          };
      };
  };
  exports["Show"] = Show;
  exports["BooleanAlgebra"] = BooleanAlgebra;
  exports["Bounded"] = Bounded;
  exports["Eq"] = Eq;
  exports["Monad"] = Monad;
  exports["Bind"] = Bind;
  exports["Applicative"] = Applicative;
  exports["Apply"] = Apply;
  exports["Functor"] = Functor;
  exports["Category"] = Category;
  exports["Semigroupoid"] = Semigroupoid;
  exports["show"] = show;
  exports["not"] = not;
  exports["disj"] = disj;
  exports["conj"] = conj;
  exports["bottom"] = bottom;
  exports["top"] = top;
  exports["/="] = $div$eq;
  exports["=="] = $eq$eq;
  exports["eq"] = eq;
  exports["<>"] = $less$greater;
  exports["append"] = append;
  exports["ap"] = ap;
  exports["return"] = $$return;
  exports[">>="] = $greater$greater$eq;
  exports["bind"] = bind;
  exports["liftA1"] = liftA1;
  exports["pure"] = pure;
  exports["<*>"] = $less$times$greater;
  exports["apply"] = apply;
  exports["<#>"] = $less$hash$greater;
  exports["<$>"] = $less$dollar$greater;
  exports["map"] = map;
  exports["id"] = id;
  exports["compose"] = compose;
  exports["otherwise"] = otherwise;
  exports["const"] = $$const;
  exports["unit"] = unit;
  exports["semigroupoidFn"] = semigroupoidFn;
  exports["categoryFn"] = categoryFn;
  exports["functorArray"] = functorArray;
  exports["eqInt"] = eqInt;
  exports["eqString"] = eqString;
  exports["boundedBoolean"] = boundedBoolean;
  exports["booleanAlgebraBoolean"] = booleanAlgebraBoolean;
  exports["showInt"] = showInt;
  exports["showArray"] = showArray;;
 
})(PS["Prelude"] = PS["Prelude"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var Prelude = PS["Prelude"];
  var $times$greater = function (__dict_Apply_1) {
      return function (a) {
          return function (b) {
              return Prelude["<*>"](__dict_Apply_1)(Prelude["<$>"](__dict_Apply_1["__superclass_Prelude.Functor_0"]())(Prelude["const"](Prelude.id(Prelude.categoryFn)))(a))(b);
          };
      };
  };
  exports["*>"] = $times$greater;;
 
})(PS["Control.Apply"] = PS["Control.Apply"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // module Control.Monad.Eff

  exports.returnE = function (a) {
    return function () {
      return a;
    };
  };

  exports.bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
 
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Control.Monad.Eff"];
  var Prelude = PS["Prelude"];     
  var monadEff = new Prelude.Monad(function () {
      return applicativeEff;
  }, function () {
      return bindEff;
  });
  var bindEff = new Prelude.Bind(function () {
      return applyEff;
  }, $foreign.bindE);
  var applyEff = new Prelude.Apply(function () {
      return functorEff;
  }, Prelude.ap(monadEff));
  var applicativeEff = new Prelude.Applicative(function () {
      return applyEff;
  }, $foreign.returnE);
  var functorEff = new Prelude.Functor(Prelude.liftA1(applicativeEff));
  exports["functorEff"] = functorEff;
  exports["applyEff"] = applyEff;
  exports["applicativeEff"] = applicativeEff;
  exports["bindEff"] = bindEff;
  exports["monadEff"] = monadEff;;
 
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
  /* global exports, console */
  "use strict";

  // module Control.Monad.Eff.Console

  exports.log = function (s) {
    return function () {
      console.log(s);
      return {};
    };
  };
 
})(PS["Control.Monad.Eff.Console"] = PS["Control.Monad.Eff.Console"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Console"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];     
  var print = function (__dict_Show_0) {
      return function (_0) {
          return $foreign.log(Prelude.show(__dict_Show_0)(_0));
      };
  };
  exports["print"] = print;;
 
})(PS["Control.Monad.Eff.Console"] = PS["Control.Monad.Eff.Console"] || {});
(function(exports) {
  /* global exports, window */
  "use strict";

  // module DOM.HTML

  exports.window = function () {
    return window;
  };
 
})(PS["DOM.HTML"] = PS["DOM.HTML"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // module Data.Foldable

  exports.foldrArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };

  exports.foldlArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };
 
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var Prelude = PS["Prelude"];
  var mempty = function (dict) {
      return dict.mempty;
  };
  exports["mempty"] = mempty;;
 
})(PS["Data.Monoid"] = PS["Data.Monoid"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Extend = PS["Control.Extend"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Monoid = PS["Data.Monoid"];     
  var Nothing = (function () {
      function Nothing() {

      };
      Nothing.value = new Nothing();
      return Nothing;
  })();
  var Just = (function () {
      function Just(value0) {
          this.value0 = value0;
      };
      Just.create = function (value0) {
          return new Just(value0);
      };
      return Just;
  })();
  var maybe = function (b) {
      return function (f) {
          return function (_0) {
              if (_0 instanceof Nothing) {
                  return b;
              };
              if (_0 instanceof Just) {
                  return f(_0.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe line 26, column 1 - line 27, column 1: " + [ b.constructor.name, f.constructor.name, _0.constructor.name ]);
          };
      };
  };                                                   
  var isJust = maybe(false)(Prelude["const"](true));
  var eqMaybe = function (__dict_Eq_8) {
      return new Prelude.Eq(function (_9) {
          return function (_10) {
              if (_9 instanceof Nothing && _10 instanceof Nothing) {
                  return true;
              };
              if (_9 instanceof Just && _10 instanceof Just) {
                  return Prelude["=="](__dict_Eq_8)(_9.value0)(_10.value0);
              };
              return false;
          };
      });
  };
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["isJust"] = isJust;
  exports["maybe"] = maybe;
  exports["eqMaybe"] = eqMaybe;;
 
})(PS["Data.Maybe"] = PS["Data.Maybe"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.Foldable"];
  var Prelude = PS["Prelude"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Endo = PS["Data.Monoid.Endo"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];     
  var Foldable = function (foldMap, foldl, foldr) {
      this.foldMap = foldMap;
      this.foldl = foldl;
      this.foldr = foldr;
  };
  var foldr = function (dict) {
      return dict.foldr;
  };
  var foldl = function (dict) {
      return dict.foldl;
  }; 
  var foldMapDefaultR = function (__dict_Foldable_26) {
      return function (__dict_Monoid_27) {
          return function (f) {
              return function (xs) {
                  return foldr(__dict_Foldable_26)(function (x) {
                      return function (acc) {
                          return Prelude["<>"](__dict_Monoid_27["__superclass_Prelude.Semigroup_0"]())(f(x))(acc);
                      };
                  })(Data_Monoid.mempty(__dict_Monoid_27))(xs);
              };
          };
      };
  };
  var foldableArray = new Foldable(function (__dict_Monoid_28) {
      return foldMapDefaultR(foldableArray)(__dict_Monoid_28);
  }, $foreign.foldlArray, $foreign.foldrArray);
  var foldMap = function (dict) {
      return dict.foldMap;
  };
  exports["Foldable"] = Foldable;
  exports["foldMapDefaultR"] = foldMapDefaultR;
  exports["foldMap"] = foldMap;
  exports["foldl"] = foldl;
  exports["foldr"] = foldr;
  exports["foldableArray"] = foldableArray;;
 
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // module Data.Traversable

  // jshint maxparams: 3

  exports.traverseArrayImpl = function () {
    function Cont (fn) {
      this.fn = fn;
    }

    var emptyList = {};

    var ConsCell = function (head, tail) {
      this.head = head;
      this.tail = tail;
    };

    function consList (x) {
      return function (xs) {
        return new ConsCell(x, xs);
      };
    }

    function listToArray (list) {
      var arr = [];
      while (list !== emptyList) {
        arr.push(list.head);
        list = list.tail;
      }
      return arr;
    }

    return function (apply) {
      return function (map) {
        return function (pure) {
          return function (f) {
            var buildFrom = function (x, ys) {
              return apply(map(consList)(f(x)))(ys);
            };

            var go = function (acc, currentLen, xs) {
              if (currentLen === 0) {
                return acc;
              } else {
                var last = xs[currentLen - 1];
                return new Cont(function () {
                  return go(buildFrom(last, acc), currentLen - 1, xs);
                });
              }
            };

            return function (array) {
              var result = go(pure(emptyList), array.length, array);
              while (result instanceof Cont) {
                result = result.fn();
              }

              return map(listToArray)(result);
            };
          };
        };
      };
    };
  }();
 
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Traversable = function (__superclass_Data$dotFoldable$dotFoldable_1, __superclass_Prelude$dotFunctor_0, sequence, traverse) {
      this["__superclass_Data.Foldable.Foldable_1"] = __superclass_Data$dotFoldable$dotFoldable_1;
      this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
      this.sequence = sequence;
      this.traverse = traverse;
  };
  var traverse = function (dict) {
      return dict.traverse;
  };
  var sequenceDefault = function (__dict_Traversable_12) {
      return function (__dict_Applicative_13) {
          return function (tma) {
              return traverse(__dict_Traversable_12)(__dict_Applicative_13)(Prelude.id(Prelude.categoryFn))(tma);
          };
      };
  };
  var traversableArray = new Traversable(function () {
      return Data_Foldable.foldableArray;
  }, function () {
      return Prelude.functorArray;
  }, function (__dict_Applicative_15) {
      return sequenceDefault(traversableArray)(__dict_Applicative_15);
  }, function (__dict_Applicative_14) {
      return $foreign.traverseArrayImpl(Prelude.apply(__dict_Applicative_14["__superclass_Prelude.Apply_0"]()))(Prelude.map((__dict_Applicative_14["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]()))(Prelude.pure(__dict_Applicative_14));
  });
  var sequence = function (dict) {
      return dict.sequence;
  };
  exports["Traversable"] = Traversable;
  exports["sequenceDefault"] = sequenceDefault;
  exports["sequence"] = sequence;
  exports["traverse"] = traverse;
  exports["traversableArray"] = traversableArray;;
 
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Extend = PS["Control.Extend"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Traversable = PS["Data.Traversable"];     
  var Left = (function () {
      function Left(value0) {
          this.value0 = value0;
      };
      Left.create = function (value0) {
          return new Left(value0);
      };
      return Left;
  })();
  var Right = (function () {
      function Right(value0) {
          this.value0 = value0;
      };
      Right.create = function (value0) {
          return new Right(value0);
      };
      return Right;
  })();
  var functorEither = new Prelude.Functor(function (f) {
      return function (_2) {
          if (_2 instanceof Left) {
              return new Left(_2.value0);
          };
          if (_2 instanceof Right) {
              return new Right(f(_2.value0));
          };
          throw new Error("Failed pattern match at Data.Either line 52, column 1 - line 56, column 1: " + [ f.constructor.name, _2.constructor.name ]);
      };
  });
  var either = function (f) {
      return function (g) {
          return function (_1) {
              if (_1 instanceof Left) {
                  return f(_1.value0);
              };
              if (_1 instanceof Right) {
                  return g(_1.value0);
              };
              throw new Error("Failed pattern match at Data.Either line 28, column 1 - line 29, column 1: " + [ f.constructor.name, g.constructor.name, _1.constructor.name ]);
          };
      };
  }; 
  var applyEither = new Prelude.Apply(function () {
      return functorEither;
  }, function (_4) {
      return function (r) {
          if (_4 instanceof Left) {
              return new Left(_4.value0);
          };
          if (_4 instanceof Right) {
              return Prelude["<$>"](functorEither)(_4.value0)(r);
          };
          throw new Error("Failed pattern match at Data.Either line 92, column 1 - line 116, column 1: " + [ _4.constructor.name, r.constructor.name ]);
      };
  });
  var bindEither = new Prelude.Bind(function () {
      return applyEither;
  }, either(function (e) {
      return function (_0) {
          return new Left(e);
      };
  })(function (a) {
      return function (f) {
          return f(a);
      };
  }));
  var applicativeEither = new Prelude.Applicative(function () {
      return applyEither;
  }, Right.create);
  exports["Left"] = Left;
  exports["Right"] = Right;
  exports["either"] = either;
  exports["functorEither"] = functorEither;
  exports["applyEither"] = applyEither;
  exports["applicativeEither"] = applicativeEither;
  exports["bindEither"] = bindEither;;
 
})(PS["Data.Either"] = PS["Data.Either"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // module Data.Foreign

  // jshint maxparams: 3
  exports.parseJSONImpl = function (left, right, str) {
    try {
      return right(JSON.parse(str));
    } catch (e) {
      return left(e.toString());
    }
  };

  exports.unsafeFromForeign = function (value) {
    return value;
  };

  exports.tagOf = function (value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };

  exports.isArray = Array.isArray || function (value) {
    return Object.prototype.toString.call(value) === "[object Array]";
  };
 
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  exports.runFn3 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return fn(a, b, c);
        };
      };
    };
  };

  exports.runFn4 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return fn(a, b, c, d);
          };
        };
      };
    };
  };

  exports.runFn8 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return function (e) {
              return function (f) {
                return function (g) {
                  return function (h) {
                    return fn(a, b, c, d, e, f, g, h);
                  };
                };
              };
            };
          };
        };
      };
    };
  };
 
})(PS["Data.Function"] = PS["Data.Function"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.Function"];
  var Prelude = PS["Prelude"];
  exports["runFn8"] = $foreign.runFn8;
  exports["runFn4"] = $foreign.runFn4;
  exports["runFn3"] = $foreign.runFn3;;
 
})(PS["Data.Function"] = PS["Data.Function"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // module Data.Int

  exports.fromNumberImpl = function (just) {
    return function (nothing) {
      return function (n) {
        /* jshint bitwise: false */
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };

  exports.toNumber = function (n) {
    return n;
  };
 
})(PS["Data.Int"] = PS["Data.Int"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.Int"];
  var Prelude = PS["Prelude"];
  var Data_Int_Bits = PS["Data.Int.Bits"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_Unsafe = PS["Data.Maybe.Unsafe"];
  var $$Math = PS["Math"];                                                                   
  var fromNumber = $foreign.fromNumberImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  exports["fromNumber"] = fromNumber;
  exports["toNumber"] = $foreign.toNumber;;
 
})(PS["Data.Int"] = PS["Data.Int"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  exports._indexOf = function (just) {
    return function (nothing) {
      return function (x) {
        return function (s) {
          var i = s.indexOf(x);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };
 
})(PS["Data.String"] = PS["Data.String"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.String"];
  var Prelude = PS["Prelude"];
  var Data_Char = PS["Data.Char"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_String_Unsafe = PS["Data.String.Unsafe"];                                          
  var indexOf = $foreign._indexOf(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  var contains = function (x) {
      return function (s) {
          return Data_Maybe.isJust(indexOf(x)(s));
      };
  };
  exports["indexOf"] = indexOf;
  exports["contains"] = contains;;
 
})(PS["Data.String"] = PS["Data.String"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.Foreign"];
  var Prelude = PS["Prelude"];
  var Data_Either = PS["Data.Either"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Function = PS["Data.Function"];
  var Data_Int = PS["Data.Int"];
  var Data_String = PS["Data.String"];     
  var TypeMismatch = (function () {
      function TypeMismatch(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      TypeMismatch.create = function (value0) {
          return function (value1) {
              return new TypeMismatch(value0, value1);
          };
      };
      return TypeMismatch;
  })();
  var ErrorAtIndex = (function () {
      function ErrorAtIndex(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtIndex.create = function (value0) {
          return function (value1) {
              return new ErrorAtIndex(value0, value1);
          };
      };
      return ErrorAtIndex;
  })();
  var JSONError = (function () {
      function JSONError(value0) {
          this.value0 = value0;
      };
      JSONError.create = function (value0) {
          return new JSONError(value0);
      };
      return JSONError;
  })();
  var unsafeReadTagged = function (tag) {
      return function (value) {
          if (Prelude["=="](Prelude.eqString)($foreign.tagOf(value))(tag)) {
              return Prelude.pure(Data_Either.applicativeEither)($foreign.unsafeFromForeign(value));
          };
          return new Data_Either.Left(new TypeMismatch(tag, $foreign.tagOf(value)));
      };
  };                                          
  var readNumber = unsafeReadTagged("Number");
  var readInt = function (value) {
      var error = Data_Either.Left.create(new TypeMismatch("Int", $foreign.tagOf(value)));
      var fromNumber = function (_30) {
          return Data_Maybe.maybe(error)(Prelude.pure(Data_Either.applicativeEither))(Data_Int.fromNumber(_30));
      };
      return Data_Either.either(Prelude["const"](error))(fromNumber)(readNumber(value));
  };                                            
  var readArray = function (value) {
      if ($foreign.isArray(value)) {
          return Prelude.pure(Data_Either.applicativeEither)($foreign.unsafeFromForeign(value));
      };
      return new Data_Either.Left(new TypeMismatch("array", $foreign.tagOf(value)));
  };
  var parseJSON = function (json) {
      return $foreign.parseJSONImpl(function (_32) {
          return Data_Either.Left.create(JSONError.create(_32));
      }, Data_Either.Right.create, json);
  };
  exports["TypeMismatch"] = TypeMismatch;
  exports["ErrorAtIndex"] = ErrorAtIndex;
  exports["JSONError"] = JSONError;
  exports["readArray"] = readArray;
  exports["readInt"] = readInt;
  exports["readNumber"] = readNumber;
  exports["unsafeReadTagged"] = unsafeReadTagged;
  exports["parseJSON"] = parseJSON;;
 
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // module Data.Array

  //------------------------------------------------------------------------------
  // Array creation --------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.range = function (start) {
    return function (end) {
      var step = start > end ? -1 : 1;
      var result = [];
      for (var i = start, n = 0; i !== end; i += step) {
        result[n++] = i;
      }
      result[n] = i;
      return result;
    };
  };

  //------------------------------------------------------------------------------
  // Array size ------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.length = function (xs) {
    return xs.length;
  };

  //------------------------------------------------------------------------------
  // Zipping ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.zipWith = function (f) {
    return function (xs) {
      return function (ys) {
        var l = xs.length < ys.length ? xs.length : ys.length;
        var result = new Array(l);
        for (var i = 0; i < l; i++) {
          result[i] = f(xs[i])(ys[i]);
        }
        return result;
      };
    };
  };
 
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.Array"];
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Maybe_Unsafe = PS["Data.Maybe.Unsafe"];
  exports["zipWith"] = $foreign.zipWith;
  exports["length"] = $foreign.length;
  exports["range"] = $foreign.range;;
 
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Array = PS["Data.Array"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Index = PS["Data.Foreign.Index"];
  var Data_Foreign_Null = PS["Data.Foreign.Null"];
  var Data_Foreign_NullOrUndefined = PS["Data.Foreign.NullOrUndefined"];
  var Data_Foreign_Undefined = PS["Data.Foreign.Undefined"];
  var Data_Int = PS["Data.Int"];
  var Data_Traversable = PS["Data.Traversable"];     
  var IsForeign = function (read) {
      this.read = read;
  };                                                           
  var read = function (dict) {
      return dict.read;
  };
  var readJSON = function (__dict_IsForeign_0) {
      return function (json) {
          return Prelude[">>="](Data_Either.bindEither)(Data_Foreign.parseJSON(json))(read(__dict_IsForeign_0));
      };
  };
  var readWith = function (__dict_IsForeign_1) {
      return function (f) {
          return function (value) {
              return Data_Either.either(function (_0) {
                  return Data_Either.Left.create(f(_0));
              })(Data_Either.Right.create)(read(__dict_IsForeign_1)(value));
          };
      };
  };
  var intIsForeign = new IsForeign(Data_Foreign.readInt);        
  var arrayIsForeign = function (__dict_IsForeign_7) {
      return new IsForeign(function (value) {
          var readElement = function (i) {
              return function (value_1) {
                  return readWith(__dict_IsForeign_7)(Data_Foreign.ErrorAtIndex.create(i))(value_1);
              };
          };
          var readElements = function (arr) {
              return Data_Traversable.sequence(Data_Traversable.traversableArray)(Data_Either.applicativeEither)(Data_Array.zipWith(readElement)(Data_Array.range(0)(Data_Array.length(arr)))(arr));
          };
          return Prelude[">>="](Data_Either.bindEither)(Data_Foreign.readArray(value))(readElements);
      });
  };
  exports["IsForeign"] = IsForeign;
  exports["readWith"] = readWith;
  exports["readJSON"] = readJSON;
  exports["read"] = read;
  exports["intIsForeign"] = intIsForeign;
  exports["arrayIsForeign"] = arrayIsForeign;;
 
})(PS["Data.Foreign.Class"] = PS["Data.Foreign.Class"] || {});
(function(exports) {
  "use strict";

  // module Unsafe.Coerce

  exports.unsafeCoerce = function(x) { return x; }
 
})(PS["Unsafe.Coerce"] = PS["Unsafe.Coerce"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Unsafe.Coerce"];
  exports["unsafeCoerce"] = $foreign.unsafeCoerce;;
 
})(PS["Unsafe.Coerce"] = PS["Unsafe.Coerce"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["DOM.HTML.Types"];
  var Prelude = PS["Prelude"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];                   
  var htmlDocumentToDocument = Unsafe_Coerce.unsafeCoerce;
  exports["htmlDocumentToDocument"] = htmlDocumentToDocument;;
 
})(PS["DOM.HTML.Types"] = PS["DOM.HTML.Types"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["DOM.HTML"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  exports["window"] = $foreign.window;;
 
})(PS["DOM.HTML"] = PS["DOM.HTML"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // module DOM.HTML.Window

  exports.document = function (window) {
    return function () {
      return window.document;
    };
  };
 
})(PS["DOM.HTML.Window"] = PS["DOM.HTML.Window"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["DOM.HTML.Window"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  exports["document"] = $foreign.document;;
 
})(PS["DOM.HTML.Window"] = PS["DOM.HTML.Window"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["DOMHelper"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM = PS["DOM"];
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var DOM_Event_EventTarget = PS["DOM.Event.EventTarget"];
  var DOM_HTML = PS["DOM.HTML"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var DOM_HTML_Window = PS["DOM.HTML.Window"];
  var DOM_Node_Element = PS["DOM.Node.Element"];
  var DOM_Node_NonElementParentNode = PS["DOM.Node.NonElementParentNode"];
  var DOM_Node_ParentNode = PS["DOM.Node.ParentNode"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Either_Unsafe = PS["Data.Either.Unsafe"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_Unsafe = PS["Data.Maybe.Unsafe"];
  var Data_Nullable = PS["Data.Nullable"];
  var getDocument = Prelude["<#>"](Control_Monad_Eff.functorEff)(Prelude[">>="](Control_Monad_Eff.bindEff)(DOM_HTML.window)(DOM_HTML_Window.document))(DOM_HTML_Types.htmlDocumentToDocument);
  exports["getDocument"] = getDocument;;
 
})(PS["DOMHelper"] = PS["DOMHelper"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];     
  var Nil = (function () {
      function Nil() {

      };
      Nil.value = new Nil();
      return Nil;
  })();
  var Cons = (function () {
      function Cons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Cons.create = function (value0) {
          return function (value1) {
              return new Cons(value0, value1);
          };
      };
      return Cons;
  })();
  var reverse = (function () {
      var go = function (__copy_acc) {
          return function (__copy__42) {
              var acc = __copy_acc;
              var _42 = __copy__42;
              tco: while (true) {
                  var acc_1 = acc;
                  if (_42 instanceof Nil) {
                      return acc_1;
                  };
                  if (_42 instanceof Cons) {
                      var __tco_acc = new Cons(_42.value0, acc);
                      var __tco__42 = _42.value1;
                      acc = __tco_acc;
                      _42 = __tco__42;
                      continue tco;
                  };
                  throw new Error("Failed pattern match at Data.List line 370, column 1 - line 371, column 1: " + [ acc.constructor.name, _42.constructor.name ]);
              };
          };
      };
      return go(Nil.value);
  })();                  
  var head = function (_13) {
      if (_13 instanceof Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (_13 instanceof Cons) {
          return new Data_Maybe.Just(_13.value0);
      };
      throw new Error("Failed pattern match at Data.List line 238, column 1 - line 239, column 1: " + [ _13.constructor.name ]);
  };
  var functorList = new Prelude.Functor(function (f) {
      return function (lst) {
          var go = function (__copy__65) {
              return function (__copy_acc) {
                  var _65 = __copy__65;
                  var acc = __copy_acc;
                  tco: while (true) {
                      if (_65 instanceof Nil) {
                          return acc;
                      };
                      if (_65 instanceof Cons) {
                          var __tco__65 = _65.value1;
                          var __tco_acc = new Cons(f(_65.value0), acc);
                          _65 = __tco__65;
                          acc = __tco_acc;
                          continue tco;
                      };
                      throw new Error("Failed pattern match at Data.List line 757, column 1 - line 764, column 1: " + [ _65.constructor.name, acc.constructor.name ]);
                  };
              };
          };
          return reverse(go(lst)(Nil.value));
      };
  });
  var fromFoldable = function (__dict_Foldable_16) {
      return Data_Foldable.foldr(__dict_Foldable_16)(Cons.create)(Nil.value);
  };
  var toList = function (__dict_Foldable_17) {
      return fromFoldable(__dict_Foldable_17);
  };
  var foldableList = new Data_Foldable.Foldable(function (__dict_Monoid_18) {
      return function (f) {
          return Data_Foldable.foldl(foldableList)(function (acc) {
              return function (_326) {
                  return Prelude.append(__dict_Monoid_18["__superclass_Prelude.Semigroup_0"]())(acc)(f(_326));
              };
          })(Data_Monoid.mempty(__dict_Monoid_18));
      };
  }, (function () {
      var go = function (__copy_o) {
          return function (__copy_b) {
              return function (__copy__67) {
                  var o = __copy_o;
                  var b = __copy_b;
                  var _67 = __copy__67;
                  tco: while (true) {
                      var b_1 = b;
                      if (_67 instanceof Nil) {
                          return b_1;
                      };
                      if (_67 instanceof Cons) {
                          var __tco_o = o;
                          var __tco_b = o(b)(_67.value0);
                          var __tco__67 = _67.value1;
                          o = __tco_o;
                          b = __tco_b;
                          _67 = __tco__67;
                          continue tco;
                      };
                      throw new Error("Failed pattern match: " + [ o.constructor.name, b.constructor.name, _67.constructor.name ]);
                  };
              };
          };
      };
      return go;
  })(), function (o) {
      return function (b) {
          return function (_66) {
              if (_66 instanceof Nil) {
                  return b;
              };
              if (_66 instanceof Cons) {
                  return o(_66.value0)(Data_Foldable.foldr(foldableList)(o)(b)(_66.value1));
              };
              throw new Error("Failed pattern match: " + [ o.constructor.name, b.constructor.name, _66.constructor.name ]);
          };
      };
  });
  var length = Data_Foldable.foldl(foldableList)(function (acc) {
      return function (_8) {
          return acc + 1 | 0;
      };
  })(0);
  var findIndex = function (fn) {
      var go = function (__copy_n) {
          return function (__copy__41) {
              var n = __copy_n;
              var _41 = __copy__41;
              tco: while (true) {
                  if (_41 instanceof Cons) {
                      if (fn(_41.value0)) {
                          return new Data_Maybe.Just(n);
                      };
                      if (Prelude.otherwise) {
                          var __tco_n = n + 1 | 0;
                          var __tco__41 = _41.value1;
                          n = __tco_n;
                          _41 = __tco__41;
                          continue tco;
                      };
                  };
                  if (_41 instanceof Nil) {
                      return Data_Maybe.Nothing.value;
                  };
                  throw new Error("Failed pattern match at Data.List line 303, column 1 - line 304, column 1: " + [ n.constructor.name, _41.constructor.name ]);
              };
          };
      };
      return go(0);
  };
  exports["Nil"] = Nil;
  exports["Cons"] = Cons;
  exports["toList"] = toList;
  exports["reverse"] = reverse;
  exports["findIndex"] = findIndex;
  exports["head"] = head;
  exports["length"] = length;
  exports["fromFoldable"] = fromFoldable;
  exports["functorList"] = functorList;
  exports["foldableList"] = foldableList;;
 
})(PS["Data.List"] = PS["Data.List"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // jshint maxparams: 1
  exports._foldM = function (bind) {
    return function (f) {
      return function (mz) {
        return function (m) {
          function g (k) {
            return function (z) {
              return f(z)(k)(m[k]);
            };
          }
          for (var k in m) {
            if (m.hasOwnProperty(k)) {
              mz = bind(mz)(g(k));
            }
          }
          return mz;
        };
      };
    };
  };

  function _collect (f) {
    return function (m) {
      var r = [];
      for (var k in m) {
        if (m.hasOwnProperty(k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }  
 
})(PS["Data.StrMap"] = PS["Data.StrMap"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.StrMap"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_List = PS["Data.List"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_StrMap_ST = PS["Data.StrMap.ST"];
  var foldM = function (__dict_Monad_5) {
      return function (f) {
          return function (z) {
              return $foreign._foldM(Prelude[">>="](__dict_Monad_5["__superclass_Prelude.Bind_1"]()))(f)(Prelude.pure(__dict_Monad_5["__superclass_Prelude.Applicative_0"]())(z));
          };
      };
  };
  exports["foldM"] = foldM;;
 
})(PS["Data.StrMap"] = PS["Data.StrMap"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  exports["regex'"] = function (s1) {
    return function (s2) {
      return new RegExp(s1, s2);
    };
  };

  exports.replace = function (r) {
    return function (s1) {
      return function (s2) {
        return s2.replace(r, s1);
      };
    };
  };
 
})(PS["Data.String.Regex"] = PS["Data.String.Regex"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.String.Regex"];
  var Prelude = PS["Prelude"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_String = PS["Data.String"];                                            
  var renderFlags = function (f) {
      return (function () {
          if (f.global) {
              return "g";
          };
          if (!f.global) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 63, column 1 - line 64, column 1: " + [ f.global.constructor.name ]);
      })() + ((function () {
          if (f.ignoreCase) {
              return "i";
          };
          if (!f.ignoreCase) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 63, column 1 - line 64, column 1: " + [ f.ignoreCase.constructor.name ]);
      })() + ((function () {
          if (f.multiline) {
              return "m";
          };
          if (!f.multiline) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 63, column 1 - line 64, column 1: " + [ f.multiline.constructor.name ]);
      })() + ((function () {
          if (f.sticky) {
              return "y";
          };
          if (!f.sticky) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 63, column 1 - line 64, column 1: " + [ f.sticky.constructor.name ]);
      })() + (function () {
          if (f.unicode) {
              return "u";
          };
          if (!f.unicode) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 63, column 1 - line 64, column 1: " + [ f.unicode.constructor.name ]);
      })())));
  };
  var regex = function (s) {
      return function (f) {
          return $foreign["regex'"](s)(renderFlags(f));
      };
  };
  var parseFlags = function (s) {
      return {
          global: Data_String.contains("g")(s), 
          ignoreCase: Data_String.contains("i")(s), 
          multiline: Data_String.contains("m")(s), 
          sticky: Data_String.contains("y")(s), 
          unicode: Data_String.contains("u")(s)
      };
  };
  exports["parseFlags"] = parseFlags;
  exports["renderFlags"] = renderFlags;
  exports["regex"] = regex;
  exports["replace"] = $foreign.replace;;
 
})(PS["Data.String.Regex"] = PS["Data.String.Regex"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_List = PS["Data.List"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_StrMap = PS["Data.StrMap"];     
  var Cyan = (function () {
      function Cyan() {

      };
      Cyan.value = new Cyan();
      return Cyan;
  })();
  var Brown = (function () {
      function Brown() {

      };
      Brown.value = new Brown();
      return Brown;
  })();
  var Red = (function () {
      function Red() {

      };
      Red.value = new Red();
      return Red;
  })();
  var Orange = (function () {
      function Orange() {

      };
      Orange.value = new Orange();
      return Orange;
  })();
  var Yellow = (function () {
      function Yellow() {

      };
      Yellow.value = new Yellow();
      return Yellow;
  })();
  var intToCube = function (_2) {
      if (_2 === 0) {
          return Cyan.value;
      };
      if (_2 === 1) {
          return Brown.value;
      };
      if (_2 === 2) {
          return Red.value;
      };
      if (_2 === 3) {
          return Orange.value;
      };
      if (_2 === 4) {
          return Yellow.value;
      };
      return Yellow.value;
  };
  exports["Cyan"] = Cyan;
  exports["Brown"] = Brown;
  exports["Red"] = Red;
  exports["Orange"] = Orange;
  exports["Yellow"] = Yellow;
  exports["intToCube"] = intToCube;;
 
})(PS["Types"] = PS["Types"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_StrMap = PS["Data.StrMap"];
  var Types = PS["Types"];
  var Data_Foldable = PS["Data.Foldable"];
  var intToStack = function (_0) {
      return Data_List.toList(Data_Foldable.foldableArray)(Prelude.map(Prelude.functorArray)(Types.intToCube)(_0));
  };
  var intToWall = function (_1) {
      return Data_List.toList(Data_Foldable.foldableArray)(Prelude.map(Prelude.functorArray)(intToStack)(_1));
  };
  var intToWalls = function (_2) {
      return Data_List.toList(Data_Foldable.foldableArray)(Prelude.map(Prelude.functorArray)(intToWall)(_2));
  };
  exports["intToWalls"] = intToWalls;
  exports["intToWall"] = intToWall;
  exports["intToStack"] = intToStack;;
 
})(PS["Helper"] = PS["Helper"] || {});
(function(exports) {
  // module Isomer

  exports.getIsomerInstance = (function () {
    var instances = {};

    return function(canvasId) {
      return function() {
        if (!instances.hasOwnProperty(canvasId)) {
          var canvas = document.getElementById(canvasId);
          instances[canvasId] = new Isomer(canvas);
        }
        return instances[canvasId];
      };
    };
  })();

  exports._renderBlock = function (isomer, x, y, z, dx, dy, dz, color) {
    return function() {
      isomer.add(
        new Isomer.Shape.Prism(new Isomer.Point(x, y, z), dx, dy, dz),
        color
        );
      return {};
    };
  };

  exports.clearCanvas = function (isomer) {
    return function() {
      isomer.canvas.clear();
      return {};
    };
  };

  exports._setIsomerConfig = function (isomer, scale, originX, originY) {
    return function() {
      isomer.scale = scale;
      isomer.originX = originX;
      isomer.originY = originY;
      isomer._calculateTransformation();
      return {};
    };
  };

  exports._colorFromRGB = function (r, g, b) {
    return new Isomer.Color(r, g, b);
  };
 
})(PS["Isomer"] = PS["Isomer"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Isomer"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Function = PS["Data.Function"];     
  var setIsomerConfig = Data_Function.runFn4($foreign._setIsomerConfig);
  var renderBlock = Data_Function.runFn8($foreign._renderBlock);
  var renderCube = function (isomer) {
      return function (x) {
          return function (y) {
              return function (z) {
                  return function (col) {
                      return renderBlock(isomer)(x)(y)(z)(0.9)(0.9)(0.9)(col);
                  };
              };
          };
      };
  };
  var colorFromRGB = Data_Function.runFn3($foreign._colorFromRGB);
  exports["colorFromRGB"] = colorFromRGB;
  exports["setIsomerConfig"] = setIsomerConfig;
  exports["renderCube"] = renderCube;
  exports["renderBlock"] = renderBlock;
  exports["clearCanvas"] = $foreign.clearCanvas;
  exports["getIsomerInstance"] = $foreign.getIsomerInstance;;
 
})(PS["Isomer"] = PS["Isomer"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Console = PS["Control.Monad.Eff.Console"];
  var DOM = PS["DOM"];
  var Data_Int = PS["Data.Int"];
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Either = PS["Data.Either"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var DOMHelper = PS["DOMHelper"];
  var Isomer = PS["Isomer"];
  var Types = PS["Types"];
  var Helper = PS["Helper"];
  var Data_String_Regex = PS["Data.String.Regex"];     
  var xPosition = function (x) {
      return function (y) {
          return x;
      };
  };
  var traverseWithKey_ = function (__dict_Monad_0) {
      return function (f) {
          return function (sm) {
              return Data_StrMap.foldM(__dict_Monad_0)(Prelude["const"](f))(Prelude.unit)(sm);
          };
      };
  };
  var traverseWithIndex_ = function (__dict_Applicative_1) {
      return function (f) {
          return function (xs) {
              var go = function (_4) {
                  return function (i) {
                      if (_4 instanceof Data_List.Nil) {
                          return Prelude["return"](__dict_Applicative_1)(Prelude.unit);
                      };
                      if (_4 instanceof Data_List.Cons) {
                          return Control_Apply["*>"](__dict_Applicative_1["__superclass_Prelude.Apply_0"]())(f(i)(_4.value0))(go(_4.value1)(i + 1 | 0));
                      };
                      throw new Error("Failed pattern match at Main line 44, column 1 - line 45, column 1: " + [ _4.constructor.name, i.constructor.name ]);
                  };
              };
              return go(xs)(0);
          };
      };
  };
  var stackNotEmpty = function (stack) {
      return Data_List.length(stack) > 0;
  };
  var wallNotEmpty = function (wall) {
      var _9 = Data_List.length(wall) === 0;
      if (_9) {
          return false;
      };
      if (!_9) {
          return Prelude["/="](Data_Maybe.eqMaybe(Prelude.eqInt))(Data_Maybe.Nothing.value)(Data_List.findIndex(stackNotEmpty)(wall));
      };
      throw new Error("Failed pattern match at Main line 74, column 1 - line 75, column 1: " + [ _9.constructor.name ]);
  };
  var spacing = 5.0;
  var replaceAll = function (pattern) {
      return function (replacement) {
          var flags = Data_String_Regex.parseFlags("g");
          return Data_String_Regex.replace(Data_String_Regex.regex(pattern)(flags))(replacement);
      };
  };
  var lengthWithDefault = function (w) {
      return Data_Maybe.maybe(5.0)(function (_17) {
          return Data_Int.toNumber(Data_List.length(_17));
      })(w);
  };
  var ignoreErrorWalls = Data_Either.either(Prelude["const"]([ [ [  ] ] ]))(Prelude.id(Prelude.categoryFn));
  var jsonToWalls = function (x) {
      return Helper.intToWalls(ignoreErrorWalls(Data_Foreign_Class.readJSON(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.intIsForeign))))(x)));
  };
  var ignoreErrorWall = Data_Either.either(Prelude["const"]([ [  ] ]))(Prelude.id(Prelude.categoryFn));
  var jsonToWall = function (x) {
      return Helper.intToWall(ignoreErrorWall(Data_Foreign_Class.readJSON(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.intIsForeign)))(x)));
  };
  var gray = Isomer.colorFromRGB(185)(185)(185);
  var cubesize = 35.0;
  var cubeColor = function (_2) {
      if (_2 instanceof Types.Cyan) {
          return Isomer.colorFromRGB(0)(160)(176);
      };
      if (_2 instanceof Types.Brown) {
          return Isomer.colorFromRGB(106)(74)(60);
      };
      if (_2 instanceof Types.Red) {
          return Isomer.colorFromRGB(204)(51)(63);
      };
      if (_2 instanceof Types.Orange) {
          return Isomer.colorFromRGB(235)(104)(65);
      };
      if (_2 instanceof Types.Yellow) {
          return Isomer.colorFromRGB(237)(201)(81);
      };
      throw new Error("Failed pattern match at Main line 28, column 1 - line 29, column 1: " + [ _2.constructor.name ]);
  };
  var renderStack = function (isomer) {
      return function (y) {
          return function (x) {
              return function (stack) {
                  return traverseWithIndex_(Control_Monad_Eff.applicativeEff)(function (z) {
                      return Isomer.renderCube(isomer)(xPosition(x)(y))(-spacing * y)(Data_Int.toNumber(z));
                  })(Prelude.map(Data_List.functorList)(cubeColor)(stack));
              };
          };
      };
  };
  var renderWall = function (isomer) {
      return function (initlen) {
          return function (y) {
              return function (_3) {
                  if (_3 instanceof Data_List.Nil) {
                      return Isomer.renderBlock(isomer)(1.0)(-spacing * y)(0.0)(5.0)(0.9)(0.1)(gray);
                  };
                  return function __do() {
                      Isomer.renderBlock(isomer)(xPosition(1.0)(y))(-spacing * y)(-0.1)(initlen - 0.1)(0.9)(0.1)(gray)();
                      return traverseWithIndex_(Control_Monad_Eff.applicativeEff)(function (x) {
                          return renderStack(isomer)(y)(Data_Int.toNumber(Data_List.length(_3) - x));
                      })(Data_List.reverse(_3))();
                  };
              };
          };
      };
  };
  var renderWalls = function (isomer) {
      return function (walls) {
          return function __do() {
              Isomer.setIsomerConfig(isomer)(cubesize)(40.0)(325.0)();
              return traverseWithIndex_(Control_Monad_Eff.applicativeEff)(function (y) {
                  return renderWall(isomer)(lengthWithDefault(Data_List.head(walls)))(Data_Int.toNumber(y));
              })(walls)();
          };
      };
  };
  var renderJSON = function (jsonwalls) {
      return function __do() {
          var _1 = DOMHelper.getDocument();
          var _0 = Isomer.getIsomerInstance("canvas")();
          Isomer.clearCanvas(_0)();
          renderWalls(_0)(jsonToWalls(jsonwalls))();
          return Control_Monad_Eff_Console.print(Prelude.showArray(Prelude.showArray(Prelude.showInt)))(Data_Either.either(Prelude["const"]([ [ 0 ] ]))(Prelude.id(Prelude.categoryFn))(Data_Foreign_Class.readJSON(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.intIsForeign)))(jsonwalls)))();
      };
  };
  var main = renderJSON("[[[]]]");
  exports["renderJSON"] = renderJSON;
  exports["main"] = main;;
 
})(PS["Main"] = PS["Main"] || {});

PS["Main"].main();
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

var util = {}
util.parseQueryString = function() {
    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};
util.guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	return v.toString(16);
    });
}
util.simpleid = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 11; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
util.store = localStorage;
util.setStore = function(name, value) {
     var jsonvalue = JSON.stringify(value)
    util.store.setItem(name, jsonvalue);
}

util.getStore = function(name, defval) {
    var val = util.store.getItem(name);
    if (!val) {
	return defval
    } else return JSON.parse(val)
}
util.getId= function() {
    if (!util.store.guid) {
	util.store.guid = util.simpleid();
    }
    return util.store.guid;
}
util.resetStore = function() {
    util.store.clear();
}

util.emojione = {};
(function(ns) {
    ns.emojioneList = {
	':scream:':["1f631"],
	':astonished:':["1f632"],
	':confused:':["1f615"],
	':rolling_eyes:':["1f644"],
	':relieved:':['1f60c'],
	':relaxed:':['263a'],
	':neutral_face:':["1f610"],
	':slight_smile:':["1f642"],
	':smiley:':["1f603"],
	':grinning:':["1f600"]};
    ns.numToShort = {
	6: ':scream:',
	5: ':astonished:',
	4: ':confused:',
	3: ':rolling_eyes:',
	2: ':relieved:',
	1: ':relaxed:',
	0: ':smiley:'
    };
    
    ns.imagePathPNG = 'http://cdn.jsdelivr.net/emojione/assets/png/';
    ns.imagePathSVG = 'http://cdn.jsdelivr.net/emojione/assets/svg/';
    ns.cacheBustParam = ''; //'?v=2.1.1';
    ns.imageType = 'png'; // png or svg
    
    ns.shortnameToImage = function(shortname) {
	unicode = ns.emojioneList[shortname][ns.emojioneList[shortname].length-1];
	alt = shortname;
	if(ns.imageType === 'png') {
	    replaceWith = '<img class="emojione" alt="'+alt+'" src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
	}
	else {
	    replaceWith = '<object class="emojione" data="'+ns.imagePathSVG+unicode+'.svg'+ns.cacheBustParam+'" type="image/svg+xml" standby="'+alt+'">'+alt+'</object>';
	}
	return replaceWith;
    }
    ns.numToImg = function(num) {
	return ns.shortnameToImage(ns.numToShort[num]);
    }
} (util.emojione));

util.log2int = function(nbestind) {
    return Math.log2(nbestind+1);
}


"use strict"
var configs = {};
if (configs.SEMPRE_URL==undefined)
    configs.SEMPRE_URL = "http://jonsson.stanford.edu:8400"
if (util.parseQueryString()["local"]==true) {
  configs.SEMPRE_URL = "http://localhost:8400";
}
configs.debugMode = false;
if (util.parseQueryString()["debug"]==true) {
  configs.debugMode = true;
}
configs.bePragmatic = true;
if (util.parseQueryString()["prag"]==false) {
  configs.bePragmatic = false;
}
configs.costPerStep = 3;
configs.costPerScroll = 1;

configs.defaultMaxSteps = 3;
configs.hardMaxSteps = true; // not allowing num steps to exceed this

configs.maximumNbest = 42;


configs.levels = []
configs.levels.push({
    id: "remove",
    name: "basics",
    maxSteps: 2,
    description: "",
    minSuccess: 5
})
configs.levels.push({
    id: "babystep",
    name: "babysteps",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "pattern",
    name: "patterns",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "babynot",
    name: "notbaby",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "babystack",
    name: "stacks",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "littlehouse",
    name: "house",
    maxSteps: 4,
    description: "",
    minSuccess: 1
})
configs.levels.push({
    id: "triangle",
    name: "triangle",
    maxSteps: 4,
    description: "",
    minSuccess: 1
})

if (false) {
configs.levels.push({
    id: "bottle",
    name: "bottle",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "fork",
    name: "fork",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "ship",
    name: "ship",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "bigrandom",
    name: "playground",
    maxSteps: 4,
    description: "",
    minSuccess: 100
})
}

"use strict"
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
      // qapair.formula = this.formatFormula(valid[i]['formula']);
      //qapair.raw = valid[i];
      qapair.score = valid[i].score.toFixed(7);
      qapair.rank = i;
      qapair.prob = valid[i].prob.toFixed(7);
      qapair.pprob = valid[i].pprob;
      lstqapairs.push(qapair);
    }

    function combine(vs, v) {
      if (vs == undefined) {
	vs = {};
	vs.value = v.value;
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
    if (configs.bePragmatic == true)
      listqadedup.sort(function(a,b){return b.maxpprob - a.maxpprob + (a.rank - b.rank)*1e-10  + (b.count - a.count)*1e-10});
    else
      listqadedup.sort(function(a,b){return b.maxprob - a.maxprob + (a.rank - b.rank)*1e-10  + (b.count - a.count)*1e-10});
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
    
    walls.push(gs.getCurrentWall())
	
    for (var i=0; i < maxWalls- wlen; i++)
	walls.push('[[]]');
    // pad
    walls.push(gs.targetWall);
    updateGoalTextPosition(gs);
    updateReaction(gs);
    updatePenaltyPoints(gs);
    updateScrollingStatus(gs);
    PSMain.renderJSON('['+walls.join(',')+']')();
}

function newWall(gs) {
    var wallcommand = "(execute (call edu.stanford.nlp.sempre.cubeworld.StacksWorld.getLevel (string {task})))"
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
	var walls = jsresp.replace(/\(string /g, '').replace(/\)|\s/g, '').split('|');
	gs.listWalls.push(walls[0]);
	gs.targetWall = walls[1];
	gs.setCurrentWall();
	updateCanvas(gs);
    })
}


var GameAction = {
    // functions starting with _ are internal, and should not modify status messages.
    _candidates: function(gs) {
	var cmds = {q:gs.query, sessionId:gs.sessionId};
	sempre.sempreQuery(cmds , function(jsonstr) {
	    var formval = sempre.parseSEMPRE(jsonstr);
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
	    updateStatus("↓: already showing the last one")
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
	document.getElementById("message").style.visibility = "visible";
    } else {
	document.getElementById("message").style.visibility = "hidden";
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
    var sempreret = document.getElementById("sempreret");
    var mystr = "<table> <tbody>"
    var formval = gs.NBest;
    for (var i in formval) {
	mystr += "<tr><td>"+
	(1+parseInt(i)) + "</td> <td>{rank}</td>  <td>{prob}</td> <td>{maxprob}</td> <td>{maxpprob}</td> <td>s:{score} c:{count} {value} </td></tr>"
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
	var cutoffs = [0.5, 0.1, 0.05, 0.01, 0.001, 0.00001, -1];
	reaction.innerHTML = util.emojione.numToImg(cutoffs.findIndex(function(val){
	    return cc >= val;
	}));
    }
}

function updatePenaltyPoints(gs) {
    var pts = gs.extraBits + gs.listNBestInd.reduce(function(a,b){return util.log2int(a) + util.log2int(b)},0) + util.log2int(gs.NBestInd);
    document.getElementById("penalty").innerHTML = pts.toFixed(1);
    console.log("updating "+pts);
}
function updateGoalTextPosition(gs) {
    var initx = 25; var inity = 180;
    var g = document.getElementById("goalblocks");
    var scalefactor = 800*0.75/1100.0; // this is radio of the widths of canvas in html vs stylesheet
    var space = 5*35*scalefactor; // these should correspond to spacing and cubesize in Main.purs
    g.style.top=(inity + (configs.levels[gs.taskind].maxSteps+1)*space*0.5)+"px"; //sin 30 and 60 due to isometry
    g.style.left=(initx + (configs.levels[gs.taskind].maxSteps+1)*space*1.717/2)+"px";

    var cb = document.getElementById("flyingdiv");
    var stepnum = gs.listWalls.length;
    cb.style.top=(inity + (stepnum)*space*0.5)+"px"; //sin 30 and 60 due to isometry
    cb.style.left=(initx -10 + (stepnum)*space*1.717/2)+"px";
}
function updateScrollingStatus(gs) {
    if (gs.noAnswer()) {
	document.getElementById("flyingaccept").disabled=true;
    } else {
	document.getElementById("flyingaccept").disabled=false;
    }
}

// DOM functions, and events
// consider retriving this list from sempre
function popTasks() {
    var puzzles = configs.puzzles;
    var ps = document.getElementById("tasks");
    ps.options.length = 0;
    for (var l in configs.levels) {
	var p1 = document.createElement("option");
	var numSucc = GS.getSuccessCount(configs.levels[l].id);
	var minSucc = configs.levels[l].minSuccess;
	var solved = numSucc >= minSucc? ' ✓' : '';
	p1.text =  (parseInt(l)+1) + " " + configs.levels[l].name
	    + " ({numSucc}/{minSucc})" 
	    ._format({numSucc:numSucc, minSucc:minSucc}) + solved
	p1.id = "level-" + configs.levels[l].id;
	
	ps.appendChild(p1);
    }
    ps.selectedIndex = GS.taskind;
}

document.getElementById("tasks").onchange = function() {
    var t = document.getElementById("tasks");
    var taskstr = configs.levels[t.selectedIndex].name;
    GS.taskind = t.selectedIndex;
    GameAction.checkAnswer(GS);
    newWall(GS);
    updateStatus("selected level {task}"._format({task:taskstr}));
};

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
document.getElementById("undobutton").onclick = function() {
    GameAction.undo(GS);
    maintextarea.focus();
};
document.getElementById("prevbutton").onclick = function() {
    GameAction.prev(GS);
    maintextarea.focus();
};
document.getElementById("nextbutton").onclick = function() {
    GameAction.next(GS);
    maintextarea.focus();
};

function acceptOnclick() {
    if (GameAction.checkAnswer(GS)) {
	GameAction.nextLevel(GS)
	ga('send', 'event', "custom", "passedlevel", GS.taskInd);
    } else {
	GameAction.accept(GS);
    }
    maintextarea.focus();
}
document.getElementById("acceptbutton").onclick = function() {
    acceptOnclick()
};

document.getElementById("flyingaccept").onclick = function() {
    acceptOnclick()
};

var Hotkeys = {
    ENTER: 13,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    Z : 90
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
	runCurrentQuery(GS); return false;
    } else if (e.keyCode == Hotkeys.Z && (e.ctrlKey || e.metaKey)) {
	GameAction.undo(GS); return false;
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



// jack the simpleid function when a user is present
if (util.parseQueryString()["user"]) {
    util.getId = function()
    {
	return util.parseQueryString()["user"];
    }
}

GS.sessionId = util.getId();
GS.successCounts = util.getStore("successCounts", {})
GS.extraBits = util.getStore("extraBits", 0)
popTasks();
document.getElementById("flyingdiv").style.visibility="visible";
document.getElementById("goalblocks").style.visibility="visible";
newWall(GS);
document.getElementById("maintextarea").focus();

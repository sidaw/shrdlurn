/*! Isomer v0.2.5 | (c) 2014 Jordan Scales | jdan.github.io/isomer/license.txt */
!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):"object"==typeof exports?exports.Isomer=n():t.Isomer=n()}(this,function(){return function(t){function n(r){if(e[r])return e[r].exports;var o=e[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){t.exports=e(5)},function(t,n,e){function r(t,n,e){return this instanceof r?(this.x="number"==typeof t?t:0,this.y="number"==typeof n?n:0,this.z="number"==typeof e?e:0,void 0):new r(t,n,e)}r.ORIGIN=new r(0,0,0),r.prototype.translate=function(t,n,e){return new r(this.x+t,this.y+n,this.z+e)},r.prototype.scale=function(t,n,e,r){var o=this.translate(-t.x,-t.y,-t.z);return void 0===e&&void 0===r?e=r=n:r="number"==typeof r?r:1,o.x*=n,o.y*=e,o.z*=r,o.translate(t.x,t.y,t.z)},r.prototype.rotateX=function(t,n){var e=this.translate(-t.x,-t.y,-t.z),r=e.z*Math.cos(n)-e.y*Math.sin(n),o=e.z*Math.sin(n)+e.y*Math.cos(n);return e.z=r,e.y=o,e.translate(t.x,t.y,t.z)},r.prototype.rotateY=function(t,n){var e=this.translate(-t.x,-t.y,-t.z),r=e.x*Math.cos(n)-e.z*Math.sin(n),o=e.x*Math.sin(n)+e.z*Math.cos(n);return e.x=r,e.z=o,e.translate(t.x,t.y,t.z)},r.prototype.rotateZ=function(t,n){var e=this.translate(-t.x,-t.y,-t.z),r=e.x*Math.cos(n)-e.y*Math.sin(n),o=e.x*Math.sin(n)+e.y*Math.cos(n);return e.x=r,e.y=o,e.translate(t.x,t.y,t.z)},r.prototype.depth=function(){return this.x+this.y-2*this.z},r.distance=function(t,n){var e=n.x-t.x,r=n.y-t.y,o=n.z-t.z;return Math.sqrt(e*e+r*r+o*o)},t.exports=r},function(t,n,e){function r(t){this.points="[object Array]"===Object.prototype.toString.call(t)?t:Array.prototype.slice.call(arguments)}var o=e(1);r.prototype.push=function(t){this.points.push(t)},r.prototype.reverse=function(){var t=Array.prototype.slice.call(this.points);return new r(t.reverse())},r.prototype.translate=function(){var t=arguments;return new r(this.points.map(function(n){return n.translate.apply(n,t)}))},r.prototype.rotateX=function(){var t=arguments;return new r(this.points.map(function(n){return n.rotateX.apply(n,t)}))},r.prototype.rotateY=function(){var t=arguments;return new r(this.points.map(function(n){return n.rotateY.apply(n,t)}))},r.prototype.rotateZ=function(){var t=arguments;return new r(this.points.map(function(n){return n.rotateZ.apply(n,t)}))},r.prototype.scale=function(){var t=arguments;return new r(this.points.map(function(n){return n.scale.apply(n,t)}))},r.prototype.depth=function(){var t,n=0;for(t=0;t<this.points.length;t++)n+=this.points[t].depth();return n/(this.points.length||1)},r.Rectangle=function(t,n,e){void 0===n&&(n=1),void 0===e&&(e=1);var i=new r([t,new o(t.x+n,t.y,t.z),new o(t.x+n,t.y+e,t.z),new o(t.x,t.y+e,t.z)]);return i},r.Circle=function(t,n,e){e=e||20;var i,s=new r;for(i=0;e>i;i++)s.push(new o(n*Math.cos(2*i*Math.PI/e),n*Math.sin(2*i*Math.PI/e),0));return s.translate(t.x,t.y,t.z)},r.Star=function(t,n,e,i){var s,a,h=new r;for(s=0;2*i>s;s++)a=s%2===0?n:e,h.push(new o(a*Math.cos(s*Math.PI/i),a*Math.sin(s*Math.PI/i),0));return h.translate(t.x,t.y,t.z)},t.exports=r},function(t,n,e){function r(t){this.elem=t,this.ctx=this.elem.getContext("2d"),this.width=t.width,this.height=t.height}r.prototype.clear=function(){this.ctx.clearRect(0,0,this.width,this.height)},r.prototype.path=function(t,n){this.ctx.beginPath(),this.ctx.moveTo(t[0].x,t[0].y);for(var e=1;e<t.length;e++)this.ctx.lineTo(t[e].x,t[e].y);this.ctx.closePath(),this.ctx.save(),this.ctx.globalAlpha=n.a,this.ctx.fillStyle=this.ctx.strokeStyle=n.toHex(),this.ctx.stroke(),this.ctx.fill(),this.ctx.restore()},t.exports=r},function(t,n,e){function r(t,n,e,r){this.r=parseInt(t||0),this.g=parseInt(n||0),this.b=parseInt(e||0),this.a=parseFloat(Math.round(100*r)/100||1),this.loadHSL()}r.prototype.toHex=function(){var t=(256*this.r*256+256*this.g+this.b).toString(16);return t.length<6&&(t=new Array(6-t.length+1).join("0")+t),"#"+t},r.prototype.lighten=function(t,n){n=n||new r(255,255,255);var e=new r(n.r/255*this.r,n.g/255*this.g,n.b/255*this.b,this.a);return e.l=Math.min(e.l+t,1),e.loadRGB(),e},r.prototype.loadHSL=function(){var t,n,e=this.r/255,r=this.g/255,o=this.b/255,i=Math.max(e,r,o),s=Math.min(e,r,o),a=(i+s)/2;if(i===s)t=n=0;else{var h=i-s;switch(n=a>.5?h/(2-i-s):h/(i+s),i){case e:t=(r-o)/h+(o>r?6:0);break;case r:t=(o-e)/h+2;break;case o:t=(e-r)/h+4}t/=6}this.h=t,this.s=n,this.l=a},r.prototype.loadRGB=function(){var t,n,e,r=this.h,o=this.s,i=this.l;if(0===o)t=n=e=i;else{var s=.5>i?i*(1+o):i+o-i*o,a=2*i-s;t=this._hue2rgb(a,s,r+1/3),n=this._hue2rgb(a,s,r),e=this._hue2rgb(a,s,r-1/3)}this.r=parseInt(255*t),this.g=parseInt(255*n),this.b=parseInt(255*e)},r.prototype._hue2rgb=function(t,n,e){return 0>e&&(e+=1),e>1&&(e-=1),1/6>e?t+6*(n-t)*e:.5>e?n:2/3>e?t+(n-t)*(2/3-e)*6:t},t.exports=r},function(t,n,e){function r(t,n){n=n||{},this.canvas=new o(t),this.angle=Math.PI/6,this.scale=n.scale||70,this._calculateTransformation(),this.originX=n.originX||this.canvas.width/2,this.originY=n.originY||.9*this.canvas.height,this.lightPosition=n.lightPosition||new p(2,-1,3),this.lightAngle=this.lightPosition.normalize(),this.colorDifference=.2,this.lightColor=n.lightColor||new i(255,255,255)}var o=e(3),i=e(4),s=e(2),a=e(1),h=e(6),p=e(7);r.prototype.setLightPosition=function(t,n,e){this.lightPosition=new p(t,n,e),this.lightAngle=this.lightPosition.normalize()},r.prototype._translatePoint=function(t){var n=new a(t.x*this.transformation[0][0],t.x*this.transformation[0][1]),e=new a(t.y*this.transformation[1][0],t.y*this.transformation[1][1]),r=this.originX+n.x+e.x,o=this.originY-n.y-e.y-t.z*this.scale;return new a(r,o)},r.prototype.add=function(t,n){if("[object Array]"==Object.prototype.toString.call(t))for(var e=0;e<t.length;e++)this.add(t[e],n);else if(t instanceof s)this._addPath(t,n);else if(t instanceof h)for(var r=t.orderedPaths(),o=0;o<r.length;o++)this._addPath(r[o],n)},r.prototype._addPath=function(t,n){n=n||new i(120,120,120);var e=p.fromTwoPoints(t.points[1],t.points[0]),r=p.fromTwoPoints(t.points[2],t.points[1]),o=p.crossProduct(e,r).normalize(),s=p.dotProduct(o,this.lightAngle),a=n.lighten(s*this.colorDifference,this.lightColor);this.canvas.path(t.points.map(this._translatePoint.bind(this)),a)},r.prototype._calculateTransformation=function(){this.transformation=[[this.scale*Math.cos(this.angle),this.scale*Math.sin(this.angle)],[this.scale*Math.cos(Math.PI-this.angle),this.scale*Math.sin(Math.PI-this.angle)]]},r.Canvas=o,r.Color=i,r.Path=s,r.Point=a,r.Shape=h,r.Vector=p,t.exports=r},function(t,n,e){function r(t){this.paths="[object Array]"===Object.prototype.toString.call(t)?t:Array.prototype.slice.call(arguments)}var o=e(2),i=e(1);r.prototype.push=function(t){this.paths.push(t)},r.prototype.translate=function(){var t=arguments;return new r(this.paths.map(function(n){return n.translate.apply(n,t)}))},r.prototype.rotateX=function(){var t=arguments;return new r(this.paths.map(function(n){return n.rotateX.apply(n,t)}))},r.prototype.rotateY=function(){var t=arguments;return new r(this.paths.map(function(n){return n.rotateY.apply(n,t)}))},r.prototype.rotateZ=function(){var t=arguments;return new r(this.paths.map(function(n){return n.rotateZ.apply(n,t)}))},r.prototype.scale=function(){var t=arguments;return new r(this.paths.map(function(n){return n.scale.apply(n,t)}))},r.prototype.orderedPaths=function(){var t=this.paths.slice();return t.sort(function(t,n){return n.depth()-t.depth()})},r.extrude=function(t,n){n="number"==typeof n?n:1;var e,i=t.translate(0,0,n),s=new r;for(s.push(t.reverse()),s.push(i),e=0;e<t.points.length;e++)s.push(new o([i.points[e],t.points[e],t.points[(e+1)%t.points.length],i.points[(e+1)%i.points.length]]));return s},r.Prism=function(t,n,e,s){n="number"==typeof n?n:1,e="number"==typeof e?e:1,s="number"==typeof s?s:1;var a=new r,h=new o([t,new i(t.x+n,t.y,t.z),new i(t.x+n,t.y,t.z+s),new i(t.x,t.y,t.z+s)]);a.push(h),a.push(h.reverse().translate(0,e,0));var p=new o([t,new i(t.x,t.y,t.z+s),new i(t.x,t.y+e,t.z+s),new i(t.x,t.y+e,t.z)]);a.push(p),a.push(p.reverse().translate(n,0,0));var u=new o([t,new i(t.x+n,t.y,t.z),new i(t.x+n,t.y+e,t.z),new i(t.x,t.y+e,t.z)]);return a.push(u.reverse()),a.push(u.translate(0,0,s)),a},r.Pyramid=function(t,n,e,s){n="number"==typeof n?n:1,e="number"==typeof e?e:1,s="number"==typeof s?s:1;var a=new r,h=new o([t,new i(t.x+n,t.y,t.z),new i(t.x+n/2,t.y+e/2,t.z+s)]);a.push(h),a.push(h.rotateZ(t.translate(n/2,e/2),Math.PI));var p=new o([t,new i(t.x+n/2,t.y+e/2,t.z+s),new i(t.x,t.y+e,t.z)]);return a.push(p),a.push(p.rotateZ(t.translate(n/2,e/2),Math.PI)),a},r.Cylinder=function(t,n,e,i){n="number"==typeof n?n:1;var s=o.Circle(t,n,e),a=r.extrude(s,i);return a},t.exports=r},function(t,n,e){function r(t,n,e){this.i="number"==typeof t?t:0,this.j="number"==typeof n?n:0,this.k="number"==typeof e?e:0}r.fromTwoPoints=function(t,n){return new r(n.x-t.x,n.y-t.y,n.z-t.z)},r.crossProduct=function(t,n){var e=t.j*n.k-n.j*t.k,o=-1*(t.i*n.k-n.i*t.k),i=t.i*n.j-n.i*t.j;return new r(e,o,i)},r.dotProduct=function(t,n){return t.i*n.i+t.j*n.j+t.k*n.k},r.prototype.magnitude=function(){return Math.sqrt(this.i*this.i+this.j*this.j+this.k*this.k)},r.prototype.normalize=function(){var t=this.magnitude();return 0===t?new r(0,0,0):new r(this.i/t,this.j/t,this.k/t)},t.exports=r}])});
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);
//# sourceMappingURL=underscore-min.map

(function(exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Phoenix Channels JavaScript client
//
// ## Socket Connection
//
// A single connection is established to the server and
// channels are mulitplexed over the connection.
// Connect to the server using the `Socket` class:
//
//     let socket = new Socket("/ws", {params: {userToken: "123"}})
//     socket.connect()
//
// The `Socket` constructor takes the mount point of the socket,
// the authentication params, as well as options that can be found in
// the Socket docs, such as configuring the `LongPoll` transport, and
// heartbeat.
//
// ## Channels
//
// Channels are isolated, concurrent processes on the server that
// subscribe to topics and broker events between the client and server.
// To join a channel, you must provide the topic, and channel params for
// authorization. Here's an example chat room example where `"new_msg"`
// events are listened for, messages are pushed to the server, and
// the channel is joined with ok/error/timeout matches:
//
//     let channel = socket.channel("rooms:123", {token: roomToken})
//     channel.on("new_msg", msg => console.log("Got message", msg) )
//     $input.onEnter( e => {
//       channel.push("new_msg", {body: e.target.val}, 10000)
//        .receive("ok", (msg) => console.log("created message", msg) )
//        .receive("error", (reasons) => console.log("create failed", reasons) )
//        .receive("timeout", () => console.log("Networking issue...") )
//     })
//     channel.join()
//       .receive("ok", ({messages}) => console.log("catching up", messages) )
//       .receive("error", ({reason}) => console.log("failed join", reason) )
//       .receive("timeout", () => console.log("Networking issue. Still waiting...") )
//
//
// ## Joining
//
// Creating a channel with `socket.channel(topic, params)`, binds the params to
// `channel.params`, which are sent up on `channel.join()`.
// Subsequent rejoins will send up the modified params for
// updating authorization params, or passing up last_message_id information.
// Successful joins receive an "ok" status, while unsuccessful joins
// receive "error".
//
//
// ## Pushing Messages
//
// From the previous example, we can see that pushing messages to the server
// can be done with `channel.push(eventName, payload)` and we can optionally
// receive responses from the push. Additionally, we can use
// `receive("timeout", callback)` to abort waiting for our other `receive` hooks
//  and take action after some period of waiting. The default timeout is 5000ms.
//
//
// ## Socket Hooks
//
// Lifecycle events of the multiplexed connection can be hooked into via
// `socket.onError()` and `socket.onClose()` events, ie:
//
//     socket.onError( () => console.log("there was an error with the connection!") )
//     socket.onClose( () => console.log("the connection dropped") )
//
//
// ## Channel Hooks
//
// For each joined channel, you can bind to `onError` and `onClose` events
// to monitor the channel lifecycle, ie:
//
//     channel.onError( () => console.log("there was an error!") )
//     channel.onClose( () => console.log("the channel has gone away gracefully") )
//
// ### onError hooks
//
// `onError` hooks are invoked if the socket connection drops, or the channel
// crashes on the server. In either case, a channel rejoin is attemtped
// automatically in an exponential backoff manner.
//
// ### onClose hooks
//
// `onClose` hooks are invoked only in two cases. 1) the channel explicitly
// closed on the server, or 2). The client explicitly closed, by calling
// `channel.leave()`
//

var VSN = "1.0.0";
var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
var DEFAULT_TIMEOUT = 10000;
var CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining"
};
var CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
};
var TRANSPORTS = {
  longpoll: "longpoll",
  websocket: "websocket"
};

var Push = function () {

  // Initializes the Push
  //
  // channel - The Channel
  // event - The event, for example `"phx_join"`
  // payload - The payload, for example `{user_id: 123}`
  // timeout - The push timeout in milliseconds
  //

  function Push(channel, event, payload, timeout) {
    _classCallCheck(this, Push);

    this.channel = channel;
    this.event = event;
    this.payload = payload || {};
    this.receivedResp = null;
    this.timeout = timeout;
    this.timeoutTimer = null;
    this.recHooks = [];
    this.sent = false;
  }

  _createClass(Push, [{
    key: "resend",
    value: function resend(timeout) {
      this.timeout = timeout;
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
      this.send();
    }
  }, {
    key: "send",
    value: function send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload,
        ref: this.ref
      });
    }
  }, {
    key: "receive",
    value: function receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }

      this.recHooks.push({ status: status, callback: callback });
      return this;
    }

    // private

  }, {
    key: "matchReceive",
    value: function matchReceive(_ref) {
      var status = _ref.status;
      var response = _ref.response;
      var ref = _ref.ref;

      this.recHooks.filter(function (h) {
        return h.status === status;
      }).forEach(function (h) {
        return h.callback(response);
      });
    }
  }, {
    key: "cancelRefEvent",
    value: function cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
  }, {
    key: "cancelTimeout",
    value: function cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }, {
    key: "startTimeout",
    value: function startTimeout() {
      var _this = this;

      if (this.timeoutTimer) {
        return;
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);

      this.channel.on(this.refEvent, function (payload) {
        _this.cancelRefEvent();
        _this.cancelTimeout();
        _this.receivedResp = payload;
        _this.matchReceive(payload);
      });

      this.timeoutTimer = setTimeout(function () {
        _this.trigger("timeout", {});
      }, this.timeout);
    }
  }, {
    key: "hasReceived",
    value: function hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
  }, {
    key: "trigger",
    value: function trigger(status, response) {
      this.channel.trigger(this.refEvent, { status: status, response: response });
    }
  }]);

  return Push;
}();

var Channel = exports.Channel = function () {
  function Channel(topic, params, socket) {
    var _this2 = this;

    _classCallCheck(this, Channel);

    this.state = CHANNEL_STATES.closed;
    this.topic = topic;
    this.params = params || {};
    this.socket = socket;
    this.bindings = [];
    this.timeout = this.socket.timeout;
    this.joinedOnce = false;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.pushBuffer = [];
    this.rejoinTimer = new Timer(function () {
      return _this2.rejoinUntilConnected();
    }, this.socket.reconnectAfterMs);
    this.joinPush.receive("ok", function () {
      _this2.state = CHANNEL_STATES.joined;
      _this2.rejoinTimer.reset();
      _this2.pushBuffer.forEach(function (pushEvent) {
        return pushEvent.send();
      });
      _this2.pushBuffer = [];
    });
    this.onClose(function () {
      _this2.socket.log("channel", "close " + _this2.topic);
      _this2.state = CHANNEL_STATES.closed;
      _this2.socket.remove(_this2);
    });
    this.onError(function (reason) {
      _this2.socket.log("channel", "error " + _this2.topic, reason);
      _this2.state = CHANNEL_STATES.errored;
      _this2.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("timeout", function () {
      if (_this2.state !== CHANNEL_STATES.joining) {
        return;
      }

      _this2.socket.log("channel", "timeout " + _this2.topic, _this2.joinPush.timeout);
      _this2.state = CHANNEL_STATES.errored;
      _this2.rejoinTimer.scheduleTimeout();
    });
    this.on(CHANNEL_EVENTS.reply, function (payload, ref) {
      _this2.trigger(_this2.replyEventName(ref), payload);
    });
  }

  _createClass(Channel, [{
    key: "rejoinUntilConnected",
    value: function rejoinUntilConnected() {
      this.rejoinTimer.scheduleTimeout();
      if (this.socket.isConnected()) {
        this.rejoin();
      }
    }
  }, {
    key: "join",
    value: function join() {
      var timeout = arguments.length <= 0 || arguments[0] === undefined ? this.timeout : arguments[0];

      if (this.joinedOnce) {
        throw "tried to join multiple times. 'join' can only be called a single time per channel instance";
      } else {
        this.joinedOnce = true;
      }
      this.rejoin(timeout);
      return this.joinPush;
    }
  }, {
    key: "onClose",
    value: function onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
  }, {
    key: "onError",
    value: function onError(callback) {
      this.on(CHANNEL_EVENTS.error, function (reason) {
        return callback(reason);
      });
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      this.bindings.push({ event: event, callback: callback });
    }
  }, {
    key: "off",
    value: function off(event) {
      this.bindings = this.bindings.filter(function (bind) {
        return bind.event !== event;
      });
    }
  }, {
    key: "canPush",
    value: function canPush() {
      return this.socket.isConnected() && this.state === CHANNEL_STATES.joined;
    }
  }, {
    key: "push",
    value: function push(event, payload) {
      var timeout = arguments.length <= 2 || arguments[2] === undefined ? this.timeout : arguments[2];

      if (!this.joinedOnce) {
        throw "tried to push '" + event + "' to '" + this.topic + "' before joining. Use channel.join() before pushing events";
      }
      var pushEvent = new Push(this, event, payload, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }

      return pushEvent;
    }

    // Leaves the channel
    //
    // Unsubscribes from server events, and
    // instructs channel to terminate on server
    //
    // Triggers onClose() hooks
    //
    // To receive leave acknowledgements, use the a `receive`
    // hook to bind to the server ack, ie:
    //
    //     channel.leave().receive("ok", () => alert("left!") )
    //

  }, {
    key: "leave",
    value: function leave() {
      var _this3 = this;

      var timeout = arguments.length <= 0 || arguments[0] === undefined ? this.timeout : arguments[0];

      var onClose = function onClose() {
        _this3.socket.log("channel", "leave " + _this3.topic);
        _this3.trigger(CHANNEL_EVENTS.close, "leave");
      };
      var leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
      leavePush.receive("ok", function () {
        return onClose();
      }).receive("timeout", function () {
        return onClose();
      });
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }

      return leavePush;
    }

    // Overridable message hook
    //
    // Receives all events for specialized message handling

  }, {
    key: "onMessage",
    value: function onMessage(event, payload, ref) {}

    // private

  }, {
    key: "isMember",
    value: function isMember(topic) {
      return this.topic === topic;
    }
  }, {
    key: "sendJoin",
    value: function sendJoin(timeout) {
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
  }, {
    key: "rejoin",
    value: function rejoin() {
      var timeout = arguments.length <= 0 || arguments[0] === undefined ? this.timeout : arguments[0];
      this.sendJoin(timeout);
    }
  }, {
    key: "trigger",
    value: function trigger(triggerEvent, payload, ref) {
      this.onMessage(triggerEvent, payload, ref);
      this.bindings.filter(function (bind) {
        return bind.event === triggerEvent;
      }).map(function (bind) {
        return bind.callback(payload, ref);
      });
    }
  }, {
    key: "replyEventName",
    value: function replyEventName(ref) {
      return "chan_reply_" + ref;
    }
  }]);

  return Channel;
}();

var Socket = exports.Socket = function () {

  // Initializes the Socket
  //
  // endPoint - The string WebSocket endpoint, ie, "ws://example.com/ws",
  //                                               "wss://example.com"
  //                                               "/ws" (inherited host & protocol)
  // opts - Optional configuration
  //   transport - The Websocket Transport, for example WebSocket or Phoenix.LongPoll.
  //               Defaults to WebSocket with automatic LongPoll fallback.
  //   timeout - The default timeout in milliseconds to trigger push timeouts.
  //             Defaults `DEFAULT_TIMEOUT`
  //   heartbeatIntervalMs - The millisec interval to send a heartbeat message
  //   reconnectAfterMs - The optional function that returns the millsec
  //                      reconnect interval. Defaults to stepped backoff of:
  //
  //     function(tries){
  //       return [1000, 5000, 10000][tries - 1] || 10000
  //     }
  //
  //   logger - The optional function for specialized logging, ie:
  //     `logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
  //
  //   longpollerTimeout - The maximum timeout of a long poll AJAX request.
  //                        Defaults to 20s (double the server long poll timer).
  //
  //   params - The optional params to pass when connecting
  //
  // For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
  //

  function Socket(endPoint) {
    var _this4 = this;

    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Socket);

    this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.timeout = opts.timeout || DEFAULT_TIMEOUT;
    this.transport = opts.transport || window.WebSocket || LongPoll;
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
    this.reconnectAfterMs = opts.reconnectAfterMs || function (tries) {
      return [1000, 2000, 5000, 10000][tries - 1] || 10000;
    };
    this.logger = opts.logger || function () {}; // noop
    this.longpollerTimeout = opts.longpollerTimeout || 20000;
    this.params = opts.params || {};
    this.endPoint = endPoint + "/" + TRANSPORTS.websocket;
    this.reconnectTimer = new Timer(function () {
      _this4.disconnect(function () {
        return _this4.connect();
      });
    }, this.reconnectAfterMs);
  }

  _createClass(Socket, [{
    key: "protocol",
    value: function protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
  }, {
    key: "endPointURL",
    value: function endPointURL() {
      var uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params), { vsn: VSN });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return this.protocol() + ":" + uri;
      }

      return this.protocol() + "://" + location.host + uri;
    }
  }, {
    key: "disconnect",
    value: function disconnect(callback, code, reason) {
      if (this.conn) {
        this.conn.onclose = function () {}; // noop
        if (code) {
          this.conn.close(code, reason || "");
        } else {
          this.conn.close();
        }
        this.conn = null;
      }
      callback && callback();
    }

    // params - The params to send when connecting, for example `{user_id: userToken}`

  }, {
    key: "connect",
    value: function connect(params) {
      var _this5 = this;

      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = params;
      }
      if (this.conn) {
        return;
      }

      this.conn = new this.transport(this.endPointURL());
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = function () {
        return _this5.onConnOpen();
      };
      this.conn.onerror = function (error) {
        return _this5.onConnError(error);
      };
      this.conn.onmessage = function (event) {
        return _this5.onConnMessage(event);
      };
      this.conn.onclose = function (event) {
        return _this5.onConnClose(event);
      };
    }

    // Logs the message. Override `this.logger` for specialized logging. noops by default

  }, {
    key: "log",
    value: function log(kind, msg, data) {
      this.logger(kind, msg, data);
    }

    // Registers callbacks for connection state change events
    //
    // Examples
    //
    //    socket.onError(function(error){ alert("An error occurred") })
    //

  }, {
    key: "onOpen",
    value: function onOpen(callback) {
      this.stateChangeCallbacks.open.push(callback);
    }
  }, {
    key: "onClose",
    value: function onClose(callback) {
      this.stateChangeCallbacks.close.push(callback);
    }
  }, {
    key: "onError",
    value: function onError(callback) {
      this.stateChangeCallbacks.error.push(callback);
    }
  }, {
    key: "onMessage",
    value: function onMessage(callback) {
      this.stateChangeCallbacks.message.push(callback);
    }
  }, {
    key: "onConnOpen",
    value: function onConnOpen() {
      var _this6 = this;

      this.log("transport", "connected to " + this.endPointURL(), this.transport.prototype);
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      if (!this.conn.skipHeartbeat) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(function () {
          return _this6.sendHeartbeat();
        }, this.heartbeatIntervalMs);
      }
      this.stateChangeCallbacks.open.forEach(function (callback) {
        return callback();
      });
    }
  }, {
    key: "onConnClose",
    value: function onConnClose(event) {
      this.log("transport", "close", event);
      this.triggerChanError();
      clearInterval(this.heartbeatTimer);
      this.reconnectTimer.scheduleTimeout();
      this.stateChangeCallbacks.close.forEach(function (callback) {
        return callback(event);
      });
    }
  }, {
    key: "onConnError",
    value: function onConnError(error) {
      this.log("transport", error);
      this.triggerChanError();
      this.stateChangeCallbacks.error.forEach(function (callback) {
        return callback(error);
      });
    }
  }, {
    key: "triggerChanError",
    value: function triggerChanError() {
      this.channels.forEach(function (channel) {
        return channel.trigger(CHANNEL_EVENTS.error);
      });
    }
  }, {
    key: "connectionState",
    value: function connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return this.connectionState() === "open";
    }
  }, {
    key: "remove",
    value: function remove(channel) {
      this.channels = this.channels.filter(function (c) {
        return !c.isMember(channel.topic);
      });
    }
  }, {
    key: "channel",
    value: function channel(topic) {
      var chanParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
  }, {
    key: "push",
    value: function push(data) {
      var _this7 = this;

      var topic = data.topic;
      var event = data.event;
      var payload = data.payload;
      var ref = data.ref;

      var callback = function callback() {
        return _this7.conn.send(JSON.stringify(data));
      };
      this.log("push", topic + " " + event + " (" + ref + ")", payload);
      if (this.isConnected()) {
        callback();
      } else {
        this.sendBuffer.push(callback);
      }
    }

    // Return the next message ref, accounting for overflows

  }, {
    key: "makeRef",
    value: function makeRef() {
      var newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }

      return this.ref.toString();
    }
  }, {
    key: "sendHeartbeat",
    value: function sendHeartbeat() {
      if (!this.isConnected()) {
        return;
      }
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.makeRef() });
    }
  }, {
    key: "flushSendBuffer",
    value: function flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach(function (callback) {
          return callback();
        });
        this.sendBuffer = [];
      }
    }
  }, {
    key: "onConnMessage",
    value: function onConnMessage(rawMessage) {
      var msg = JSON.parse(rawMessage.data);
      var topic = msg.topic;
      var event = msg.event;
      var payload = msg.payload;
      var ref = msg.ref;

      this.log("receive", (payload.status || "") + " " + topic + " " + event + " " + (ref && "(" + ref + ")" || ""), payload);
      this.channels.filter(function (channel) {
        return channel.isMember(topic);
      }).forEach(function (channel) {
        return channel.trigger(event, payload, ref);
      });
      this.stateChangeCallbacks.message.forEach(function (callback) {
        return callback(msg);
      });
    }
  }]);

  return Socket;
}();

var LongPoll = exports.LongPoll = function () {
  function LongPoll(endPoint) {
    _classCallCheck(this, LongPoll);

    this.endPoint = null;
    this.token = null;
    this.skipHeartbeat = true;
    this.onopen = function () {}; // noop
    this.onerror = function () {}; // noop
    this.onmessage = function () {}; // noop
    this.onclose = function () {}; // noop
    this.pollEndpoint = this.normalizeEndpoint(endPoint);
    this.readyState = SOCKET_STATES.connecting;

    this.poll();
  }

  _createClass(LongPoll, [{
    key: "normalizeEndpoint",
    value: function normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)\/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
  }, {
    key: "endpointURL",
    value: function endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
  }, {
    key: "closeAndRetry",
    value: function closeAndRetry() {
      this.close();
      this.readyState = SOCKET_STATES.connecting;
    }
  }, {
    key: "ontimeout",
    value: function ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry();
    }
  }, {
    key: "poll",
    value: function poll() {
      var _this8 = this;

      if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
        return;
      }

      Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), function (resp) {
        if (resp) {
          var status = resp.status;
          var token = resp.token;
          var messages = resp.messages;

          _this8.token = token;
        } else {
          var status = 0;
        }

        switch (status) {
          case 200:
            messages.forEach(function (msg) {
              return _this8.onmessage({ data: JSON.stringify(msg) });
            });
            _this8.poll();
            break;
          case 204:
            _this8.poll();
            break;
          case 410:
            _this8.readyState = SOCKET_STATES.open;
            _this8.onopen();
            _this8.poll();
            break;
          case 0:
          case 500:
            _this8.onerror();
            _this8.closeAndRetry();
            break;
          default:
            throw "unhandled poll status " + status;
        }
      });
    }
  }, {
    key: "send",
    value: function send(body) {
      var _this9 = this;

      Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), function (resp) {
        if (!resp || resp.status !== 200) {
          _this9.onerror(status);
          _this9.closeAndRetry();
        }
      });
    }
  }, {
    key: "close",
    value: function close(code, reason) {
      this.readyState = SOCKET_STATES.closed;
      this.onclose();
    }
  }]);

  return LongPoll;
}();

var Ajax = exports.Ajax = function () {
  function Ajax() {
    _classCallCheck(this, Ajax);
  }

  _createClass(Ajax, null, [{
    key: "request",
    value: function request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (window.XDomainRequest) {
        var req = new XDomainRequest(); // IE8, IE9
        this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        var req = window.XMLHttpRequest ? new XMLHttpRequest() : // IE7+, Firefox, Chrome, Opera, Safari
        new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
        this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
  }, {
    key: "xdomainRequest",
    value: function xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      var _this10 = this;

      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = function () {
        var response = _this10.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }

      // Work around bug in IE9 that requires an attached onprogress handler
      req.onprogress = function () {};

      req.send(body);
    }
  }, {
    key: "xhrRequest",
    value: function xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      var _this11 = this;

      req.timeout = timeout;
      req.open(method, endPoint, true);
      req.setRequestHeader("Content-Type", accept);
      req.onerror = function () {
        callback && callback(null);
      };
      req.onreadystatechange = function () {
        if (req.readyState === _this11.states.complete && callback) {
          var response = _this11.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }

      req.send(body);
    }
  }, {
    key: "parseJSON",
    value: function parseJSON(resp) {
      return resp && resp !== "" ? JSON.parse(resp) : null;
    }
  }, {
    key: "serialize",
    value: function serialize(obj, parentKey) {
      var queryStr = [];
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        var paramKey = parentKey ? parentKey + "[" + key + "]" : key;
        var paramVal = obj[key];
        if ((typeof paramVal === "undefined" ? "undefined" : _typeof(paramVal)) === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
  }, {
    key: "appendParams",
    value: function appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }

      var prefix = url.match(/\?/) ? "&" : "?";
      return "" + url + prefix + this.serialize(params);
    }
  }]);

  return Ajax;
}();

Ajax.states = { complete: 4 };

// Creates a timer that accepts a `timerCalc` function to perform
// calculated timeout retries, such as exponential backoff.
//
// ## Examples
//
//    let reconnectTimer = new Timer(() => this.connect(), function(tries){
//      return [1000, 5000, 10000][tries - 1] || 10000
//    })
//    reconnectTimer.scheduleTimeout() // fires after 1000
//    reconnectTimer.scheduleTimeout() // fires after 5000
//    reconnectTimer.reset()
//    reconnectTimer.scheduleTimeout() // fires after 1000
//

var Timer = function () {
  function Timer(callback, timerCalc) {
    _classCallCheck(this, Timer);

    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = null;
    this.tries = 0;
  }

  _createClass(Timer, [{
    key: "reset",
    value: function reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }

    // Cancels any previous scheduleTimeout and schedules callback

  }, {
    key: "scheduleTimeout",
    value: function scheduleTimeout() {
      var _this12 = this;

      clearTimeout(this.timer);

      this.timer = setTimeout(function () {
        _this12.tries = _this12.tries + 1;
        _this12.callback();
      }, this.timerCalc(this.tries + 1));
    }
  }]);

  return Timer;
}();


})(typeof(exports) === "undefined" ? window.Phoenix = window.Phoenix || {} : exports);

/**
 * Simple, lightweight, usable local autocomplete library for modern browsers
 * Because there weren’t enough autocomplete scripts in the world? Because I’m completely insane and have NIH syndrome? Probably both. :P
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * MIT license
 */

(function () {

var _ = function (input, o) {
	var me = this;

	// Setup

	this.input = $(input);
	this.input.setAttribute("autocomplete", "off");
	this.input.setAttribute("aria-autocomplete", "list");

	o = o || {};

	configure(this, {
		minChars: 2,
		maxItems: 10,
		autoFirst: false,
		data: _.DATA,
		filter: _.FILTER_CONTAINS,
		sort: _.SORT_BYLENGTH,
		item: _.ITEM,
		replace: _.REPLACE
	}, o);

	this.index = -1;

	// Create necessary elements

	this.container = $.create("div", {
		className: "awesomplete",
		around: input
	});

	this.ul = $.create("ul", {
		hidden: "hidden",
		inside: this.container
	});

	this.status = $.create("span", {
		className: "visually-hidden",
		role: "status",
		"aria-live": "assertive",
		"aria-relevant": "additions",
		inside: this.container
	});

	// Bind events

	$.bind(this.input, {
		"input": this.evaluate.bind(this),
		"blur": this.close.bind(this),
		"keydown": function(evt) {
			var c = evt.keyCode;

			// If the dropdown `ul` is in view, then act on keydown for the following keys:
			// Enter / Esc / Up / Down
			if(me.opened) {
				if (c === 13 && me.selected) { // Enter
					evt.preventDefault();
					me.select();
				}
				else if (c === 27) { // Esc
					me.close();
				}
				else if (c === 38 || c === 40) { // Down/Up arrow
					evt.preventDefault();
					me[c === 38? "previous" : "next"]();
				}
			}
		}
	});

	$.bind(this.input.form, {"submit": this.close.bind(this)});

	$.bind(this.ul, {"mousedown": function(evt) {
		var li = evt.target;

		if (li !== this) {

			while (li && !/li/i.test(li.nodeName)) {
				li = li.parentNode;
			}

			if (li && evt.button === 0) {  // Only select on left click
				evt.preventDefault();
				me.select(li, evt.target);
			}
		}
	}});

	if (this.input.hasAttribute("list")) {
		this.list = "#" + this.input.getAttribute("list");
		this.input.removeAttribute("list");
	}
	else {
		this.list = this.input.getAttribute("data-list") || o.list || [];
	}

	_.all.push(this);
};

_.prototype = {
	set list(list) {
		if (Array.isArray(list)) {
			this._list = list;
		}
		else if (typeof list === "string" && list.indexOf(",") > -1) {
				this._list = list.split(/\s*,\s*/);
		}
		else { // Element or CSS selector
			list = $(list);

			if (list && list.children) {
				var items = [];
				slice.apply(list.children).forEach(function (el) {
					if (!el.disabled) {
						var text = el.textContent.trim();
						var value = el.value || text;
						var label = el.label || text;
						if (value !== "") {
							items.push({ label: label, value: value });
						}
					}
				});
				this._list = items;
			}
		}

		if (document.activeElement === this.input) {
			this.evaluate();
		}
	},

	get selected() {
		return this.index > -1;
	},

	get opened() {
		return !this.ul.hasAttribute("hidden");
	},

	close: function () {
		this.ul.setAttribute("hidden", "");
		this.index = -1;

		$.fire(this.input, "awesomplete-close");
	},

	open: function () {
		this.ul.removeAttribute("hidden");

		if (this.autoFirst && this.index === -1) {
			this.goto(0);
		}

		$.fire(this.input, "awesomplete-open");
	},

	next: function () {
		var count = this.ul.children.length;

		this.goto(this.index < count - 1? this.index + 1 : -1);
	},

	previous: function () {
		var count = this.ul.children.length;

		this.goto(this.selected? this.index - 1 : count - 1);
	},

	// Should not be used, highlights specific item without any checks!
	goto: function (i) {
		var lis = this.ul.children;

		if (this.selected) {
			lis[this.index].setAttribute("aria-selected", "false");
		}

		this.index = i;

		if (i > -1 && lis.length > 0) {
			lis[i].setAttribute("aria-selected", "true");
			this.status.textContent = lis[i].textContent;

			$.fire(this.input, "awesomplete-highlight", {
				text: this.suggestions[this.index]
			});
		}
	},

	select: function (selected, origin) {
		if (selected) {
			this.index = $.siblingIndex(selected);
		} else {
			selected = this.ul.children[this.index];
		}

		if (selected) {
			var suggestion = this.suggestions[this.index];

			var allowed = $.fire(this.input, "awesomplete-select", {
				text: suggestion,
				origin: origin || selected
			});

			if (allowed) {
				this.replace(suggestion);
				this.close();
				$.fire(this.input, "awesomplete-selectcomplete", {
					text: suggestion
				});
			}
		}
	},

	evaluate: function() {
		var me = this;
		var value = this.input.value;

		if (value.length >= this.minChars && this._list.length > 0) {
			this.index = -1;
			// Populate list with options that match
			this.ul.innerHTML = "";

			this.suggestions = this._list
				.map(function(item) {
					return new Suggestion(me.data(item, value));
				})
				.filter(function(item) {
					return me.filter(item, value);
				})
				.sort(this.sort)
				.slice(0, this.maxItems);

			this.suggestions.forEach(function(text) {
					me.ul.appendChild(me.item(text, value));
				});

			if (this.ul.children.length === 0) {
				this.close();
			} else {
				this.open();
			}
		}
		else {
			this.close();
		}
	}
};

// Static methods/properties

_.all = [];

_.FILTER_CONTAINS = function (text, input) {
	return RegExp($.regExpEscape(input.trim()), "i").test(text);
};

_.FILTER_STARTSWITH = function (text, input) {
	return RegExp("^" + $.regExpEscape(input.trim()), "i").test(text);
};

_.SORT_BYLENGTH = function (a, b) {
	if (a.length !== b.length) {
		return a.length - b.length;
	}

	return a < b? -1 : 1;
};

_.ITEM = function (text, input) {
	var html = input === '' ? text : text.replace(RegExp($.regExpEscape(input.trim()), "gi"), "<mark>$&</mark>");
	return $.create("li", {
		innerHTML: html,
		"aria-selected": "false"
	});
};

_.REPLACE = function (text) {
	this.input.value = text.value;
};

_.DATA = function (item/*, input*/) { return item; };

// Private functions

function Suggestion(data) {
	var o = Array.isArray(data)
	  ? { label: data[0], value: data[1] }
	  : typeof data === "object" && "label" in data && "value" in data ? data : { label: data, value: data };

	this.label = o.label || o.value;
	this.value = o.value;
}
Object.defineProperty(Suggestion.prototype = Object.create(String.prototype), "length", {
	get: function() { return this.label.length; }
});
Suggestion.prototype.toString = Suggestion.prototype.valueOf = function () {
	return "" + this.label;
};

function configure(instance, properties, o) {
	for (var i in properties) {
		var initial = properties[i],
		    attrValue = instance.input.getAttribute("data-" + i.toLowerCase());

		if (typeof initial === "number") {
			instance[i] = parseInt(attrValue);
		}
		else if (initial === false) { // Boolean options must be false by default anyway
			instance[i] = attrValue !== null;
		}
		else if (initial instanceof Function) {
			instance[i] = null;
		}
		else {
			instance[i] = attrValue;
		}

		if (!instance[i] && instance[i] !== 0) {
			instance[i] = (i in o)? o[i] : initial;
		}
	}
}

// Helpers

var slice = Array.prototype.slice;

function $(expr, con) {
	return typeof expr === "string"? (con || document).querySelector(expr) : expr || null;
}

function $$(expr, con) {
	return slice.call((con || document).querySelectorAll(expr));
}

$.create = function(tag, o) {
	var element = document.createElement(tag);

	for (var i in o) {
		var val = o[i];

		if (i === "inside") {
			$(val).appendChild(element);
		}
		else if (i === "around") {
			var ref = $(val);
			ref.parentNode.insertBefore(element, ref);
			element.appendChild(ref);
		}
		else if (i in element) {
			element[i] = val;
		}
		else {
			element.setAttribute(i, val);
		}
	}

	return element;
};

$.bind = function(element, o) {
	if (element) {
		for (var event in o) {
			var callback = o[event];

			event.split(/\s+/).forEach(function (event) {
				element.addEventListener(event, callback);
			});
		}
	}
};

$.fire = function(target, type, properties) {
	var evt = document.createEvent("HTMLEvents");

	evt.initEvent(type, true, true );

	for (var j in properties) {
		evt[j] = properties[j];
	}

	return target.dispatchEvent(evt);
};

$.regExpEscape = function (s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

$.siblingIndex = function (el) {
	/* eslint-disable no-cond-assign */
	for (var i = 0; el = el.previousElementSibling; i++);
	return i;
};

// Initialization

function init() {
	$$("input.awesomplete").forEach(function (input) {
		new _(input);
	});
}

// Are we in a browser? Check for Document constructor
if (typeof Document !== "undefined") {
	// DOM already loaded?
	if (document.readyState !== "loading") {
		init();
	}
	else {
		// Wait for it
		document.addEventListener("DOMContentLoaded", init);
	}
}

_.$ = $;
_.$$ = $$;

// Make sure to export Awesomplete on self when in a browser
if (typeof self !== "undefined") {
	self.Awesomplete = _;
}

// Expose Awesomplete as a CJS module
if (typeof module === "object" && module.exports) {
	module.exports = _;
}

return _;

}());

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

  //- Bounded --------------------------------------------------------------------

  exports.topInt = 2147483647;
  exports.bottomInt = -2147483648;

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
  var eq = function (dict) {
      return dict.eq;
  };
  var $eq$eq = function (__dict_Eq_7) {
      return eq(__dict_Eq_7);
  };
  var $$const = function (a) {
      return function (_3) {
          return a;
      };
  };
  var compose = function (dict) {
      return dict.compose;
  };
  var categoryFn = new Category(function () {
      return semigroupoidFn;
  }, function (x) {
      return x;
  });
  var boundedInt = new Bounded($foreign.bottomInt, $foreign.topInt);
  var bottom = function (dict) {
      return dict.bottom;
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
  exports["bottom"] = bottom;
  exports["top"] = top;
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
  exports["eqString"] = eqString;
  exports["boundedInt"] = boundedInt;
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
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["isJust"] = isJust;
  exports["maybe"] = maybe;;
 
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
  /* global exports */
  "use strict";

  // module Data.Maybe.Unsafe

  exports.unsafeThrow = function (msg) {
    throw new Error(msg);
  };
 
})(PS["Data.Maybe.Unsafe"] = PS["Data.Maybe.Unsafe"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Data.Maybe.Unsafe"];
  var Prelude = PS["Prelude"];
  var Data_Maybe = PS["Data.Maybe"];     
  var fromJust = function (_0) {
      if (_0 instanceof Data_Maybe.Just) {
          return _0.value0;
      };
      if (_0 instanceof Data_Maybe.Nothing) {
          return $foreign.unsafeThrow("Data.Maybe.Unsafe.fromJust called on Nothing");
      };
      throw new Error("Failed pattern match at Data.Maybe.Unsafe line 10, column 1 - line 11, column 1: " + [ _0.constructor.name ]);
  };
  exports["fromJust"] = fromJust;;
 
})(PS["Data.Maybe.Unsafe"] = PS["Data.Maybe.Unsafe"] || {});
(function(exports) {
  /* global exports */
  "use strict";          

  exports.floor = Math.floor;
 
})(PS["Math"] = PS["Math"] || {});
(function(exports) {
  // Generated by psc version 0.7.6.1
  "use strict";
  var $foreign = PS["Math"];
  exports["floor"] = $foreign.floor;;
 
})(PS["Math"] = PS["Math"] || {});
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
  var unsafeClamp = function (x) {
      if (x >= $foreign.toNumber(Prelude.top(Prelude.boundedInt))) {
          return Prelude.top(Prelude.boundedInt);
      };
      if (x <= $foreign.toNumber(Prelude.bottom(Prelude.boundedInt))) {
          return Prelude.bottom(Prelude.boundedInt);
      };
      if (Prelude.otherwise) {
          return Data_Maybe_Unsafe.fromJust(fromNumber(x));
      };
      throw new Error("Failed pattern match at Data.Int line 48, column 1 - line 49, column 1: " + [ x.constructor.name ]);
  };
  var floor = function (_2) {
      return unsafeClamp($$Math.floor(_2));
  };
  exports["floor"] = floor;
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
          return function (__copy__41) {
              var acc = __copy_acc;
              var _41 = __copy__41;
              tco: while (true) {
                  var acc_1 = acc;
                  if (_41 instanceof Nil) {
                      return acc_1;
                  };
                  if (_41 instanceof Cons) {
                      var __tco_acc = new Cons(_41.value0, acc);
                      var __tco__41 = _41.value1;
                      acc = __tco_acc;
                      _41 = __tco__41;
                      continue tco;
                  };
                  throw new Error("Failed pattern match at Data.List line 368, column 1 - line 369, column 1: " + [ acc.constructor.name, _41.constructor.name ]);
              };
          };
      };
      return go(Nil.value);
  })();
  var fromFoldable = function (__dict_Foldable_16) {
      return Data_Foldable.foldr(__dict_Foldable_16)(Cons.create)(Nil.value);
  };
  var toList = function (__dict_Foldable_17) {
      return fromFoldable(__dict_Foldable_17);
  };
  exports["Nil"] = Nil;
  exports["Cons"] = Cons;
  exports["toList"] = toList;
  exports["reverse"] = reverse;
  exports["fromFoldable"] = fromFoldable;;
 
})(PS["Data.List"] = PS["Data.List"] || {});
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
  var Green = (function () {
      function Green() {

      };
      Green.value = new Green();
      return Green;
  })();
  var Blue = (function () {
      function Blue() {

      };
      Blue.value = new Blue();
      return Blue;
  })();
  var Purple = (function () {
      function Purple() {

      };
      Purple.value = new Purple();
      return Purple;
  })();
  var Tran = (function () {
      function Tran() {

      };
      Tran.value = new Tran();
      return Tran;
  })();
  var Mark = (function () {
      function Mark() {

      };
      Mark.value = new Mark();
      return Mark;
  })();
  var FreeMark = (function () {
      function FreeMark() {

      };
      FreeMark.value = new FreeMark();
      return FreeMark;
  })();
  var intToCube = function (_2) {
      if (_2 === 0) {
          return Red.value;
      };
      if (_2 === 1) {
          return Orange.value;
      };
      if (_2 === 2) {
          return Yellow.value;
      };
      if (_2 === 3) {
          return Green.value;
      };
      if (_2 === 4) {
          return Blue.value;
      };
      if (_2 === 5) {
          return Purple.value;
      };
      if (_2 === 6) {
          return Brown.value;
      };
      if (_2 === 7) {
          return Cyan.value;
      };
      if (_2 === 9) {
          return Tran.value;
      };
      if (_2 === 10) {
          return Mark.value;
      };
      if (_2 === 11) {
          return FreeMark.value;
      };
      return Red.value;
  };
  exports["Cyan"] = Cyan;
  exports["Brown"] = Brown;
  exports["Red"] = Red;
  exports["Orange"] = Orange;
  exports["Yellow"] = Yellow;
  exports["Green"] = Green;
  exports["Blue"] = Blue;
  exports["Purple"] = Purple;
  exports["Tran"] = Tran;
  exports["Mark"] = Mark;
  exports["FreeMark"] = FreeMark;
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
        new Isomer.Shape.Prism(new Isomer.Point(x, y, z), dx, dy, dz).rotateZ(new Isomer.Point(0, 0, 0), 1 * Math.PI / 12),
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
  var colorFromRGB = Data_Function.runFn3($foreign._colorFromRGB);
  exports["colorFromRGB"] = colorFromRGB;
  exports["setIsomerConfig"] = setIsomerConfig;
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
  var $$Math = PS["Math"];
  var Data_String_Regex = PS["Data.String.Regex"];     
  var xPosition = function (x) {
      return function (y) {
          return x;
      };
  };
  var worldsize = 8.0;
  var traverseWithIndex_ = function (__dict_Applicative_0) {
      return function (f) {
          return function (xs) {
              var go = function (_5) {
                  return function (i) {
                      if (_5 instanceof Data_List.Nil) {
                          return Prelude["return"](__dict_Applicative_0)(Prelude.unit);
                      };
                      if (_5 instanceof Data_List.Cons) {
                          return Control_Apply["*>"](__dict_Applicative_0["__superclass_Prelude.Apply_0"]())(f(i)(_5.value0))(go(_5.value1)(i + 1 | 0));
                      };
                      throw new Error("Failed pattern match at Main line 53, column 1 - line 54, column 1: " + [ _5.constructor.name, i.constructor.name ]);
                  };
              };
              return go(xs)(0);
          };
      };
  };
  var spacing = 8.0;
  var replaceAll = function (pattern) {
      return function (replacement) {
          var flags = Data_String_Regex.parseFlags("g");
          return Data_String_Regex.replace(Data_String_Regex.regex(pattern)(flags))(replacement);
      };
  };
  var relsize = 0.9;
  var renderCube = function (isomer) {
      return function (x) {
          return function (y) {
              return function (z) {
                  return function (col) {
                      return Isomer.renderBlock(isomer)(x)(y)(z)(relsize)(relsize)(relsize)(col);
                  };
              };
          };
      };
  };
  var markcolor = Isomer.colorFromRGB(80)(80)(80);
  var ignoreErrorWalls = Data_Either.either(Prelude["const"]([ [ [  ] ] ]))(Prelude.id(Prelude.categoryFn));
  var jsonToWalls = function (x) {
      return Helper.intToWalls(ignoreErrorWalls(Data_Foreign_Class.readJSON(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.intIsForeign))))(x)));
  };
  var ignoreErrorWall = Data_Either.either(Prelude["const"]([ [  ] ]))(Prelude.id(Prelude.categoryFn));
  var jsonToWall = function (x) {
      return Helper.intToWall(ignoreErrorWall(Data_Foreign_Class.readJSON(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.intIsForeign)))(x)));
  };
  var gray = Isomer.colorFromRGB(185)(185)(185);
  var darkgray = Isomer.colorFromRGB(100)(100)(100);
  var cubesize = 35.0;
  var cubeColor = function (_4) {
      if (_4 instanceof Types.Cyan) {
          return Isomer.colorFromRGB(0)(160)(176);
      };
      if (_4 instanceof Types.Brown) {
          return Isomer.colorFromRGB(106)(74)(60);
      };
      if (_4 instanceof Types.Red) {
          return Isomer.colorFromRGB(204)(51)(63);
      };
      if (_4 instanceof Types.Orange) {
          return Isomer.colorFromRGB(235)(104)(65);
      };
      if (_4 instanceof Types.Yellow) {
          return Isomer.colorFromRGB(237)(201)(81);
      };
      if (_4 instanceof Types.Green) {
          return Isomer.colorFromRGB(50)(205)(50);
      };
      if (_4 instanceof Types.Blue) {
          return Isomer.colorFromRGB(30)(144)(255);
      };
      if (_4 instanceof Types.Purple) {
          return Isomer.colorFromRGB(160)(32)(240);
      };
      return Isomer.colorFromRGB(0)(0)(0);
  };
  var renderStack = function (isomer) {
      return function (y) {
          return function (x) {
              return function (stack) {
                  var draw = function (_6) {
                      return function (z) {
                          if (_6 instanceof Data_List.Nil) {
                              return Prelude["return"](Control_Monad_Eff.applicativeEff)(Prelude.unit);
                          };
                          if (_6 instanceof Data_List.Cons && _6.value0 instanceof Types.Tran) {
                              return Control_Apply["*>"](Control_Monad_Eff.applyEff)(Prelude["return"](Control_Monad_Eff.applicativeEff)(Prelude.unit))(draw(_6.value1)(z + 1.0));
                          };
                          if (_6 instanceof Data_List.Cons && _6.value0 instanceof Types.Mark) {
                              return Control_Apply["*>"](Control_Monad_Eff.applyEff)(Isomer.renderBlock(isomer)(x + (1.0 - 0.5) / 2.0)(y + (1.0 - 0.5) / 2.0)(z - 0.1)(0.5)(0.5)(0.25)(markcolor))(draw(_6.value1)(z));
                          };
                          if (_6 instanceof Data_List.Cons) {
                              return Control_Apply["*>"](Control_Monad_Eff.applyEff)(renderCube(isomer)(x + 5.0e-2)(y + 5.0e-2)(z)(cubeColor(_6.value0)))(draw(_6.value1)(z + 1.0));
                          };
                          throw new Error("Failed pattern match at Main line 73, column 1 - line 74, column 1: " + [ _6.constructor.name, z.constructor.name ]);
                      };
                  };
                  return function __do() {
                      Isomer.renderBlock(isomer)(x + 5.0e-2)(y + 5.0e-2)(-0.1)(0.9)(0.9)(0.1)(gray)();
                      return draw(stack)(0.0)();
                  };
              };
          };
      };
  };
  var advanceCol = function (x) {
      return Data_Int.toNumber(x % Data_Int.floor(worldsize));
  };
  var advance = function (x) {
      return Data_Int.toNumber(Data_Int.floor(Data_Int.toNumber(x) / worldsize));
  };
  var renderWall = function (isomer) {
      return function (initlen) {
          return function (y) {
              return function (wall) {
                  return function __do() {
                      Isomer.renderBlock(isomer)((1.0 + spacing * y) - y * 2.25)(((-spacing * y - worldsize) + 1.0) - y * 2.25)(-0.1)(worldsize)(worldsize)(0.1)(darkgray)();
                      return traverseWithIndex_(Control_Monad_Eff.applicativeEff)(function (x) {
                          return renderStack(isomer)(-spacing * y - advance(x) - y * 2.25)(((worldsize - advanceCol(x)) + spacing * y) - y * 2.25);
                      })(Data_List.reverse(wall))();
                  };
              };
          };
      };
  };
  var renderWalls = function (isomer) {
      return function (walls) {
          return traverseWithIndex_(Control_Monad_Eff.applicativeEff)(function (y) {
              return renderWall(isomer)(worldsize)(Data_Int.toNumber(y));
          })(walls);
      };
  };
  var renderJSON = function (jsonwalls) {
      return function __do() {
          var _1 = DOMHelper.getDocument();
          var _0 = Isomer.getIsomerInstance("canvas")();
          Isomer.clearCanvas(_0)();
          Isomer.setIsomerConfig(_0)(35.0)(30.0)(350.0 + 248.0)();
          return renderWalls(_0)(jsonToWalls(jsonwalls))();
      };
  };
  var renderTargetJSON = function (jsonwalls) {
      return function __do() {
          var _3 = DOMHelper.getDocument();
          var _2 = Isomer.getIsomerInstance("canvastarget")();
          Isomer.clearCanvas(_2)();
          Isomer.setIsomerConfig(_2)(12.0)(5.0)(160.0)();
          renderWalls(_2)(jsonToWalls(jsonwalls))();
          return Control_Monad_Eff_Console.print(Prelude.showArray(Prelude.showArray(Prelude.showInt)))(Data_Either.either(Prelude["const"]([ [ 0 ] ]))(Prelude.id(Prelude.categoryFn))(Data_Foreign_Class.readJSON(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.arrayIsForeign(Data_Foreign_Class.intIsForeign)))(jsonwalls)))();
      };
  };
  var main = function __do() {
      renderJSON("[[[]]]")();
      return renderTargetJSON("[[]]")();
  };
  exports["renderTargetJSON"] = renderTargetJSON;
  exports["renderJSON"] = renderJSON;
  exports["main"] = main;;
 
})(PS["Main"] = PS["Main"] || {});

PS["Main"].main();
"use strict"
var configs = {};
if (configs.SEMPRE_URL==undefined)
    configs.SEMPRE_URL = "http://jonsson.stanford.edu:8401"
// configs.SEMPRE_URL = "http://localhost:8400"
configs.hardMaxSteps = false; // not allowing num steps to exceed this

configs.debugMode = false;

configs.defLengthLimit = 100;
configs.uttLengthLimit = 60;

configs.levels = [];

configs.levels.push({
    id: "randomworld",
    name: "random",
    maxSteps: 1,
    description: "",
    minSuccess: 5
});

configs.levels.push({
    id: "emptyworld",
    name: "empty",
    maxSteps: 1,
    description: "",
    minSuccess: 5
});

configs.loggerServer = "ws://hydrogen.samginn.com:4000/socket";

/* States */
// var STATES = [
//   "[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[2,4,4,0,0,0,2,3,3],[2,4,4,0,0,0,2,3,3,4,4],[2,4,4,0,0,0,2,3,3],[],[],[],[],[],[2,4,4,0,0,0,3,3,0,0,0],[2,4,4,0,0,0,3,3,0,0,0,4,4],[2,4,4,0,0,0,3,3,0,0,0],[],[],[],[],[],[2,4,4,0,0,0,1,3,3],[2,4,4,0,0,0,1,3,3,4,4],[2,4,4,0,0,0,1,3,3],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]",
//   "[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[3,3,3,3,3,3,3],[0],[0],[0],[0],[0],[0],[2,2,2],[0,0,0,0,0,0],[0],[0],[0],[0],[0],[0],[4,4,4,4],[1,1,1,1,1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]",
//   "[[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0]]",
//   "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,2,2],[4,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,2,2],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]",
//   "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]",
//   "[[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0,1],[2,3,4,0,1,2],[2,3,4,0,1,2,3],[2,3,4,0,1,2,3,0],[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0,1],[2,3,4,0,1,2],[2,3,4,0,1,2,3],[2,3,4,0,1,2,3],[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0,1],[2,3,4,0,1,2],[2,3,4,0,1,2],[2,3,4,0,1,2],[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0,1],[2,3,4,0,1],[2,3,4,0,1],[2,3,4,0,1],[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0],[2,3,4,0],[2,3,4,0],[2,3,4,0],[2],[2,3],[2,3,4],[2,3,4],[2,3,4],[2,3,4],[2,3,4],[2,3,4],[2],[2,3],[2,3],[2,3],[2,3],[2,3],[2,3],[2,3],[2],[2],[2],[2],[2],[2],[2],[2]]",
//   "[[4],[0],[4],[0],[4],[0],[4],[0],[0],[4],[0],[4],[0],[4],[0],[4],[4],[0],[4],[0],[4],[0],[4],[0],[0],[4],[0],[4],[0],[4],[0],[4],[4],[0],[4],[0],[4],[0],[4],[0],[0],[4],[0],[4],[0],[4],[0],[4],[4],[0],[4],[0],[4],[0],[4],[0],[0],[4],[0],[4],[0],[4],[0],[4]]",
//   "[[1,1],[1,1],[],[],[],[],[1,1],[1,1],[1,1],[1,1],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[1,1],[1,1],[],[],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[],[],[],[],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[],[],[],[],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[],[],[],[],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[],[],[1,1],[1,1],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[1,1],[1,1],[1,1],[1,1],[],[],[],[],[1,1],[1,1]]",
//   "[[2],[3,3],[4,4,4],[0,0,0,0],[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],[2],[3,3],[4,4,4],[0,0,0,0],[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],[2],[3,3],[4,4,4],[0,0,0,0],[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[4,4,4,4,4,4],[4,4,4,4,4,4],[4,4,4,4,4,4],[4,4,4,4,4,4],[4,4,4,4,4,4],[4,4,4,4,4,4],[4,4,4,4,4,4],[4,4,4,4,4,4],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2]]",
//   "[[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[2,2,2],[2,2,2],[0,0,0],[0,0,0],[4,4,4],[4,4,4],[0,0,0],[0,0,0],[2,2,2],[2,2,2],[0,0,0],[0,0,0],[4,4,4],[4,4,4],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[3,3,3],[3,3,3],[0,0,0],[0,0,0],[1,1,1],[1,1,1],[0,0,0],[0,0,0],[3,3,3],[3,3,3],[0,0,0],[0,0,0],[1,1,1],[1,1,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]",
//   "random"
// ];
configs.emptyWall = "[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]";
configs.defaultWall = "[[],[],[],[],[],[],[],[],[],[],[],[0,0,0,2],[],[],[],[],[],[],[],[9,9,9,2,6],[],[],[],[],[],[],[],[9,9,9,2,6,6,10],[],[],[],[],[],[],[],[9,9,9,2,6],[],[],[],[],[],[],[],[0,0,0,2],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]";
// Possible in nSteps, Maximum alloted nSteps, Target Wall
var STATES = [
  [7, "[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[0,0,0,0,0,2],[9,9,9,9,9,2],[9,9,9,9,9,2],[0,0,0,0,0,2,2,2,2,2,2],[],[],[],[],[9,9,9,9,9,2],[9,9,9,9,9,2],[9,9,9,9,9,2],[9,9,9,9,9,2,2,2,2,2,2],[],[],[],[],[9,9,9,9,9,2],[9,9,9,9,9,2],[9,9,9,9,9,2],[9,9,9,9,9,2,2,2,2,2,2],[],[],[],[],[0,0,0,0,0,2],[9,9,9,9,9,2],[9,9,9,9,9,2],[0,0,0,0,0,2,2,2,2,2,2],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]"],//chair
  [5, "[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[0,0],[9,0,0],[9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[2],[9],[9,9,2],[9,9,9],[9,9,9,2],[9,9,9],[9,9,9,2],[9,9,9],[2],[9],[9,9,2],[9,9,9],[9,9,9,2],[9,9,9],[9,9,9,2],[9,9,9],[0,0],[9,0,0],[9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]"],
  [5, "[[],[],[],[],[],[],[],[],[],[],[],[0,0,0,2],[],[],[],[],[],[],[],[9,9,9,2,6],[],[],[],[],[],[],[],[9,9,9,2,6,6,10],[],[],[],[],[],[],[],[9,9,9,2,6],[],[],[],[],[],[],[],[0,0,0,2],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]"],
  [3, "[[2],[],[],[4],[],[],[1],[],[2,2],[],[],[4,4],[],[],[1,1],[],[2,2,2],[],[],[4,4,4],[],[],[1,1,1],[],[2,2,2,2],[],[],[4,4,4,4],[],[],[1,1,1,1],[],[2,2,2,2],[],[],[4,4,4,4],[],[],[1,1,1,1],[],[2,2,2],[],[],[4,4,4],[],[],[1,1,1],[],[2,2],[],[],[4,4],[],[],[1,1],[],[2],[],[],[4],[],[],[1],[]]"],
  [4, "[[3],[2],[0],[],[],[0],[2],[3],[2],[3],[2],[0],[0],[2],[3],[2],[0],[2],[3],[2],[2],[3],[2],[0],[],[0],[2],[3],[3],[2],[0],[],[],[0],[2],[3],[3],[2],[0],[],[0],[2],[3],[2],[2],[3],[2],[0],[2],[3],[2],[0],[0],[2],[3],[2],[3],[2],[0],[],[],[0],[2],[3]]"],
  [5, "[[],[],[],[4,1,3,3,3,3,3,3,3],[],[],[],[],[],[],[],[2,2,0,3,3,3,3,3,3],[],[],[],[],[],[],[],[4,4,4,1,3,3,3,3,3],[],[],[],[],[],[],[],[2,2,2,2,0,3,3,3,3],[],[],[],[],[],[],[],[4,4,4,4,4,1,3,3,3],[],[],[],[],[],[],[],[2,2,2,2,2,2,0,3,3],[],[],[],[],[],[],[],[4,4,4,4,4,4,4,1,3],[],[],[],[],[],[],[],[2,2,2,2,2,2,2,2,0],[],[],[],[]]"],
  [3, "[[0,0,0,0],[],[],[],[],[],[],[0,0,0,0],[1,1,1,1,4,4],[],[],[],[],[],[],[1,1,1,1,4,4],[0,0,0,0],[],[],[],[],[],[],[0,0,0,0],[],[],[],[],[],[],[],[],[],[],[],[],[0,0,0,0],[],[],[],[],[],[],[],[1,1,1,1,4,4],[],[],[],[],[],[],[],[0,0,0,0],[],[],[],[],[],[],[],[],[],[],[]]"],
  [4, "[[],[],[],[1],[1],[],[],[],[4],[4],[4],[4,1],[4,1],[4],[4],[4],[4,2],[4,2],[4,2],[4,2,1],[4,2,1],[4,2],[4,2],[4,2],[4,2,0],[4,2,0],[4,2,0],[4,2,0,1],[4,2,0,1],[4,2,0],[4,2,0],[4,2,0],[4,2,0],[4,2,0],[4,2,0],[4,2,0,1],[4,2,0,1],[4,2,0],[4,2,0],[4,2,0],[4,2],[4,2],[4,2],[4,2,1],[4,2,1],[4,2],[4,2],[4,2],[4],[4],[4],[4,1],[4,1],[4],[4],[4],[],[],[],[1],[1],[],[],[]]"], 
  [4, "[[2],[2,0],[2,0,4],[2,0,4,3],[2,0,4,3],[2,0,4],[2,0],[2],[2],[2,0],[2,0,4],[2,0,4,3],[2,0,4,3],[2,0,4],[2,0],[2],[2],[2,0],[2,0,4],[2,0,4,3],[2,0,4,3],[2,0,4],[2,0],[2],[2],[2,0],[2,0,4],[2,0,4,3],[2,0,4,3],[2,0,4],[2,0],[2],[2],[2,0],[2,0,4],[2,0,4,3],[2,0,4,3],[2,0,4],[2,0],[2],[2],[2,0],[2,0,4],[2,0,4,3],[2,0,4,3],[2,0,4],[2,0],[2],[2],[2,0],[2,0,4],[2,0,4,3],[2,0,4,3],[2,0,4],[2,0],[2],[2],[2,0],[2,0,4],[2,0,4,3],[2,0,4,3],[2,0,4],[2,0],[2]]"],
  [2, "[[0],[0],[0],[2,0],[2,2,0],[2,2,2,0],[2,2,2,2,0],[2,2,2,2,2,0],[],[],[],[2],[2,2],[2,2,2],[2,2,2,2],[2,2,2,2,2],[0],[0],[0],[2,0],[2,2,0],[2,2,2,0],[2,2,2,2,0],[2,2,2,2,2,0],[],[],[],[2],[2,2],[2,2,2],[2,2,2,2],[2,2,2,2,2],[0],[0],[0],[2,0],[2,2,0],[2,2,2,0],[2,2,2,2,0],[2,2,2,2,2,0],[],[],[],[2],[2,2],[2,2,2],[2,2,2,2],[2,2,2,2,2],[0],[0],[0],[2,0],[2,2,0],[2,2,2,0],[2,2,2,2,0],[2,2,2,2,2,0],[],[],[],[2],[2,2],[2,2,2],[2,2,2,2],[2,2,2,2,2]]"],
  [2, "[[2,2,2],[],[],[],[2,2,2],[],[],[],[2,2,2,0],[],[],[],[2,2,2,0],[],[],[],[2,2,2],[],[],[],[2,2,2],[],[],[],[2,2,2,0],[],[],[],[2,2,2,0],[],[],[],[2,2,2],[],[],[],[2,2,2],[],[],[],[2,2,2,0],[],[],[],[2,2,2,0],[],[],[],[2,2,2],[],[],[],[2,2,2],[],[],[],[2,2,2,0],[],[],[],[2,2,2,0],[],[],[]]"],
  [3, "[[4],[4],[4],[4],[4],[4],[4],[4],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[2],[0],[4],[4],[4],[4],[4],[4],[4],[4]]"],
  [5, "[[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[],[],[],[],[],[],[],[],[1,1,1],[1,1,1,0],[1,1,1],[1,1,1,0],[1,1,1],[1,1,1,0],[1,1,1],[1,1,1,0],[],[],[],[],[],[],[],[],[4,4,4],[4,4,4,0],[4,4,4],[4,4,4,0],[4,4,4],[4,4,4,0],[4,4,4],[4,4,4,0],[],[],[],[],[],[],[],[],[3,3,3],[3,3,3,0],[3,3,3],[3,3,3,0],[3,3,3],[3,3,3,0],[3,3,3],[3,3,3,0],[],[],[],[],[],[],[],[]]"],
  [5, "[[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[4,4,4],[1],[1],[1],[1],[1],[1],[1,3],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0],[2,2,2],[2,2,2,0]]"],
  [4, "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]"],
   [4, "[[1,1],[1,1],[],[],[],[],[1,1],[1,1],[1,1],[1,1],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[1,1],[1,1],[],[],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[],[],[],[],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[],[],[],[],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[],[],[],[],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[],[],[1,1],[1,1],[2,2,4],[2,2,4,0],[2,2,4,0],[2,2,4],[1,1],[1,1],[1,1],[1,1],[],[],[],[],[1,1],[1,1]]"],
  [2, "[[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4],[4],[4],[4],[4],[4],[4],[4],[3],[3],[3],[3],[3],[3],[3],[3],[2,2],[2,2],[2,2],[2,2],[2,2],[2,2],[2,2],[2,2],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]"],
  [4, "[[2,2],[2,2],[],[],[],[],[1,1],[1,1],[2,2],[2,2],[],[],[],[],[1,1],[1,1],[],[],[2,2],[2,2],[1,1],[1,1],[],[],[],[],[2,2],[2,2],[1,1],[1,1],[],[],[],[],[1,1],[1,1],[2,2],[2,2],[],[],[],[],[1,1],[1,1],[2,2],[2,2],[],[],[1,1],[1,1],[],[],[],[],[2,2],[2,2],[1,1],[1,1],[],[],[],[],[2,2],[2,2]]"],
    [4, "[[2],[2],[2],[2],[2],[2],[2],[2],[2],[3],[3],[3],[3],[3],[3],[2],[2],[3],[0],[0],[0],[0],[3],[2],[2],[3],[0],[4],[4],[0],[3],[2],[2],[3],[0],[4],[4],[0],[3],[2],[2],[3],[0],[0],[0],[0],[3],[2],[2],[3],[3],[3],[3],[3],[3],[2],[2],[2],[2],[2],[2],[2],[2],[2]]"],
  [6, "[[0],[4],[],[],[],[],[],[],[3],[0,2],[4],[],[],[],[0,2],[],[],[3],[0],[4],[],[],[],[],[],[],[3],[0,2],[4],[],[],[],[],[],[],[3],[0],[4],[],[],[],[],[],[],[3],[0,2],[4],[],[],[0,2],[],[],[],[3],[0],[4],[],[],[],[],[],[],[3],[0]]"],
  [6, "[[1,2],[1,2],[1,2],[1,2],[0,2],[],[],[4,2],[4,2],[],[],[],[0,2],[],[],[4,2],[4,2],[],[],[],[0,2],[],[],[4,2],[4,2],[],[],[],[0,2],[],[],[4,2],[4,2],[],[],[],[0,2],[],[],[4,2],[4,2],[],[],[],[0,2],[],[],[4,2],[4,2],[],[],[],[0,2],[],[],[4,2],[4,2],[],[],[],[3,2],[3,2],[3,2],[4,2]]"],
  [8, "[[1,1,1],[],[],[],[],[],[],[1,1,1],[],[2],[],[],[],[],[2],[],[],[],[2],[],[],[2],[],[],[],[],[],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[],[],[],[],[],[],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[],[],[],[],[],[2],[],[],[2],[],[],[],[2],[],[],[],[],[2],[],[1,1,1],[],[],[],[],[],[],[1,1,1]]"]
]
/*
 [8, "[[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0,1],[2,3,4,0,1,2],[2,3,4,0,1,2,3],[2,3,4,0,1,2,3,0],[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0,1],[2,3,4,0,1,2],[2,3,4,0,1,2,3],[2,3,4,0,1,2,3],[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0,1],[2,3,4,0,1,2],[2,3,4,0,1,2],[2,3,4,0,1,2],[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0,1],[2,3,4,0,1],[2,3,4,0,1],[2,3,4,0,1],[2],[2,3],[2,3,4],[2,3,4,0],[2,3,4,0],[2,3,4,0],[2,3,4,0],[2,3,4,0],[2],[2,3],[2,3,4],[2,3,4],[2,3,4],[2,3,4],[2,3,4],[2,3,4],[2],[2,3],[2,3],[2,3],[2,3],[2,3],[2,3],[2,3],[2],[2],[2],[2],[2],[2],[2],[2]]"],
*/

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
util.hashCode = function(str){
	var hash = 0;
	if (str.length == 0) return hash;
	for (i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash%1000;
}
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

util.store = sessionStorage;

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


var allURLParameters = util.parseQueryString();
// jack the simpleid function when a user is present
if (allURLParameters["user"]) {
    util.getId = function()
    {
	return util.parseQueryString()["user"];
    }
}
// jack the simpleid function when mturkid is present
if (allURLParameters["mturkid"]) {
    document.getElementById("turker").style.display="block";
    util.store = sessionStorage;
    util.getId = function()
    {
	return util.parseQueryString()["mturkid"];
    }
}
if (allURLParameters.hasOwnProperty("debug")) {
  configs.debugMode = true;
  document.getElementById("debugdiv").className = "";
}
if (allURLParameters.hasOwnProperty("local") {
  configs.SEMPRE_URL = "http://localhost:8400"
}

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

  parseSEMPRE: function (valid) {
    
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

  formatQuery: function (ques) {
    var sanity = ques.replace(/(\+|-|%)/g, ' $1 ').replace(/(\(|\))/g, '').replace(/"/g,"")
	.replace(/=/g, '= ').replace(/(>|<)/g, ' $1')
	.replace(/(>|<)(?!=)/g, '$1 ').replace(/([^><])=/g, '$1 =')
    if (configs.debugMode)
      console.log(sanity);
    return sanity;
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


function Logger() {
  this.socket = new window.Phoenix.Socket(configs.loggerServer, {
    logger: (function(kind, msg, data) { console.log(kind+": "+msg, data) })
  });

  this.init = function(gs) {
    this.socket.connect();
    this.socket.onOpen( function(ev){ console.log("OPEN", ev)} );
    this.socket.onError( function(ev){ console.log("ERROR", ev)} );
    this.socket.onClose( function(ev){ console.log("CLOSE", e)});

    this.chan = this.socket.channel("session:" + gs.sessionId, {});
    this.chan.join();
  }

  this.log = function(e) {
    var message = e.type + ": " + e.msg;
    this.chan.push('log:event', { message: message });
  }
}

"use strict"
function GameState() {
  // the walls, just json strings
  this.currentWall = configs.emptyWall;
  this.targetWall = configs.emptyWall;
  this.listWalls = [];

  this.NBest = []; // current answer list returned by sempre
  this.NBestInd = 0;

  this.query = "";
  this.taskind = 0;

  this.log = {};
  this.log.numQueries = 0;
  this.log.totalTokens = 0;
  this.log.numScrolls = 0;
  
  this.nSteps = 1;
  this.maxSteps = 100;
  this.targetIndex = -1;
  this.skipsLeft = 2;
  if (configs.debugMode)
    this.skipsLeft = 100;

  this.tutorialMode = false;
  this.tutorialLevel = 2;

  this.coverage = [];
  this.define_coverage = [];
  this.taggedCover = [];
  this.taggedDefineCover = [];
  this.defineState = false;
  this.defineSuccess = "";
  this.reverting = -1;

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

  this.getLastWall = function() {
    return this.listWalls[this.listWalls.length-1];
  }
    
  this.setCurrentWall = function() {
    if (this.NBest.length>0)
      this.currentWall = this.NBest[this.NBestInd].value;
    else
      this.currentWall = configs.emptyWall;
  }

  this.getCurrentWall = function() {
    if ( this.currentWall && this.currentWall.length > 0)
    {
      return this.currentWall;
    }
    return configs.emptyWall;
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
  this.incrementSuccessCount = function(levelid, amount) {
    if (this.successCounts[levelid] == undefined)
      this.successCounts[levelid] = amount;
    else {
      this.successCounts[levelid] = parseInt(this.successCounts[levelid])+amount;
    }
    util.setStore("successCounts", this.successCounts)
  }
}

var GS = new GameState();

function updateCanvas(gs) {
  var PSMain = PS.Main;
  var walls = [];

  if (!gs.noQuery() && gs.noAnswer() && !(gs.defineSuccess.length > 0)) {
    document.getElementById("show_define_status").className = "";
    updateStatus("SHRDLURN did not understand.");
  } else { document.getElementById("show_define_status").className = "hidden"}

  if (!gs.noAnswer()) {
    updateStatus("got " + gs.NBest.length + " options. use ↓ and ↑ to scroll, and ✓ to confirm.");
  }

  var wlen = gs.listWalls.length;
  var maxWalls = 1;

  // cut
  if (wlen <= maxWalls) {
    walls = walls.concat(gs.listWalls)
  } else { // shift left when the sequences gets too long
    walls = walls.concat(gs.listWalls.slice(wlen - maxWalls));
  }

  walls.push(gs.getCurrentWall());

  for (var i=0; i < maxWalls- wlen; i++)
    walls.push(configs.emptyWall);

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
  gs.query = "";
  gs.listWalls = [];

  sempre.sempreQuery(cmds, function (jsonstr) {
    if (jsonstr == "ERR_CONNECTION_REFUSED") {
      updateStatus("our server might be down...")
      return
    }
    var wall = JSON.parse(jsonstr)['commandResponse'];
    // var wall = jsresp.replace(/\(string /g, '').replace(/\)|\s/g, '');
    console.log("got this wall: " + wall);
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
    // if (gs.tutorialMode && (gs.tutorialLevel == 6 || gs.tutorialLevel == 12)) {
    //   if (gs.tutorialLevel == 6) gs.taggedCover = [["$Action", "add orange"], ["$UNK", "except", "the", "border"]];
    //   if (gs.tutorialLevel == 11) gs.taggedCover = [["$UNK", "add", "2"], ["$Color", "red"], ["$Cond", "if", "col", "=", "4", "or", "col", "=", "5"]];
    //   gs.taggedDefineCover = gs.taggedCover;
    //   gs.resetNBest();
    //   gs.setCurrentWall();
    //   updateCanvas(gs);
    //   return;
    // }

    var cmds = {q:gs.query, sessionId:gs.sessionId};

    sempre.sempreQuery(cmds , function(jsonstr) {
      var jsonparse = JSON.parse(jsonstr);
      console.log(jsonparse);
      gs.taggedCover = jsonparse["taggedcover"];
      gs.taggedDefineCover = gs.taggedCover;

      var formval = sempre.parseSEMPRE(jsonparse['candidates']);
      if (formval == null) {
	console.log('no answer from sempre')
        gs.resetNBest();
	gs.setCurrentWall();
      } else {
	gs.NBestInd = 0;
	gs.NBest = formval;
	gs.setCurrentWall();
      }
      if (configs.debugMode) {
	console.log(jsonparse);
	writeSemAns(gs);
      }
      updateCanvas(gs);
      if (gs.tutorialMode && (gs.tutorialLevel == 6 || gs.tutorialLevel == 12)) {
        GS.resetNBest();
        GS.setCurrentWall();
        updateCanvas(GS);
      }
    });

    // Update random utterances
    updateRandomUtterances(gs);
  },
  _simpleaccept: function(gs) {
    sempre.sempreQuery({q: gs.query, accept:gs.NBest[gs.NBestInd].rank, sessionId:gs.sessionId}, function(){})
  },
  candidates: function(gs) {
    var contextcommand = "(context (graph NaiveKnowledgeGraph ((string {wall}) (name b) (name c))))"
	._format({wall:gs.listWalls[gs.listWalls.length-1]}); // attach arguments here!
    var cmds = {q:contextcommand, sessionId:gs.sessionId};
    sempre.sempreQuery(cmds , function(jsonrespcontext) {
      GameAction._candidates(gs);
    });
  },
  prev: function(gs) {
    if (gs.noAnswer()) {
      updateStatus("↑: can't scroll, say something or or ⎌");
      return;
    }
    if (gs.prevIfPossible()) {
      updateCanvas(gs);
      updateStatus("↑: showing the previous one");
      Logger.log({type: "scroll", msg: "prev"});
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
      updateCanvas(gs);
      updateStatus("↓: showing the next one");
      Logger.log({ type: "scroll", msg: "next" });
    } else {
      updateStatus("↓: already showing the last one");
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

      if (gs.currentWall == gs.targetWall) {
        completed_target();
      }

      var count = (gs.query.match(/then/g) || []).length;
      gs.nSteps += count + 1;
      gs.listWalls.push(gs.currentWall);
      gs.resetNBest();
      gs.query = "";
      gs.setCurrentWall();
      addPoint("accept");
      updateCanvas(gs);
      updateStatus("✓: accepted (#{accept}/{length}), enter another command"
		   ._format({accept:gs.NBestInd, length:gs.NBest.length}))
    } else {
      updateStatus("✓: can't accept nothing, say something first");
    }
  }
};

//*************** DOM stuff

function logh(strlog) {document.getElementById("history").innerHTML += strlog; }
function updateStatus(strstatus)
{
  document.getElementById("status").innerHTML = strstatus;
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

// function updateGoalTextPosition(gs) {
//   var initx = 100; var inity = 280;
//   var g = document.getElementById("goalblocks");
//   var scalefactor = 800*0.75/1100.0; // this is radio of the widths of canvas in html vs stylesheet
//   var space = 5*35*scalefactor; // these should correspond to spacing and cubesize in Main.purs
//   g.style.top=(inity + (configs.levels[gs.taskind].maxSteps+1)*space*0.5)+"px"; //sin 30 and 60 due to isometry
//   g.style.left=(initx + (configs.levels[gs.taskind].maxSteps+1)*space*1.717/2)+"px";
// }

// State stuff

function updateRandomUtterances(gs) {
  sempre.sempreQuery({q:'(autocomplete "")', sessionId:gs.sessionId}, function(jsonstr) {
    var autocompletes = JSON.parse(jsonstr).autocompletes;
    var random_strings = "";
    for (var i = 0; i < 4 && i < autocompletes.length; i++) {
      random_strings += "<span>" + autocompletes[i] + "</span><br/>";
    }
    document.getElementById("random_utterances").innerHTML = random_strings;
  });
}

function saveGameState(gs, name) {
  // var state = { name: name, data: gs.listWalls[gs.listWalls.length - 1] };
  // var states = util.store.getItem("states");
  // if (states === null) { states = []; }
  // else { states = JSON.parse(states); }
  // states.push(state);
  // util.store.setItem("states", JSON.stringify(states));
  // popTasks();
}

function addElemToHistory(gs, history, text, definition) {
  if (definition == undefined) definition = false;
  if (gs.currentWall == "[[]]") { return; }

  var elem = document.createElement("div");
  elem.setAttribute("data-index", gs.listWalls.length - 1);
  elem.setAttribute("data-walls", gs.currentWall);
  if (!definition) {
    elem.setAttribute("data-steps", gs.nSteps);
    document.getElementById("recipe_steps").innerHTML = "(" + gs.nSteps + "/" + gs.maxSteps + ")";
    text = gs.nSteps + ". " + text;
  }
  elem.innerHTML = text;
  history.insertBefore(elem, history.firstChild);
  elem.onclick = function() {
    revertHistory(gs, elem.getAttribute("data-index"));
  }
  Logger.log({type: "action", msg: text});
}

Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

function updateHistory(gs) {
  var history = document.getElementById("command_history");
  var elems = history.childNodes;

  if (gs.reverting >= 0) {
    var found = false;
    while (found == false) {
      found = true;
      history = document.getElementById("command_history");
      elems = history.childNodes;
      for (var i = 0; i < elems.length; i++) {
        if (parseInt(elems[i].getAttribute("data-index")) > gs.reverting) {
          history.removeChild(elems[i]);
          found = false;
          break;
        }
      }
    }

    gs.reverting = -1;
  }

  addElemToHistory(gs, history, gs.query);

  highlightHistory(gs, -2);
}

function wipeHistory(gs, wall) {
  var history = document.getElementById("command_history");
  history.innerHTML = "";

  var elem = document.createElement("div");
  elem.setAttribute("data-index", -1);
  elem.setAttribute("data-walls", wall);
  elem.innerHTML = "initial";
  history.appendChild(elem);

  elem.onclick = function() {
    revertHistory(gs, elem.getAttribute("data-index"));
  }

  Logger.log({type: "history", msg: "clear"});
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

function undoHistory(gs) {
  var elems = document.querySelectorAll("#command_history > div");
  var index = elems[1].getAttribute("data-index");
  for (var i = 0; i < elems.length; i++) {
    if (hasClass(elems[i], "active")) {
      console.log(i);
      console.log(elems[i].getAttribute("data-index"));
      if (elems[i].getAttribute("data-index") == "-1") { return; }
      index = elems[i+1].getAttribute("data-index");
    }
  }
  revertHistory(gs, index);

  Logger.log({type: "history", msg: "undo"});
}

function redoHistory(gs) {
  var elems = document.querySelectorAll("#command_history > div");
  var index = elems[0].getAttribute("data-index");
  for (var i = elems.length - 1; i > 0; i--) {
    if (hasClass(elems[i], "active")) {
      index = elems[i-1].getAttribute("data-index");
    }
  }
  revertHistory(gs, index);

  Logger.log({type: "history", msg: "redo"});
}

function revertHistory(gs, index) {
  var elem = document.querySelectorAll("#command_history > div[data-index='" + index + "']")[0];
  var wall = elem.getAttribute("data-walls");
  PS.Main.renderJSON("[" + wall + ","+configs.emptyWall+"]")();

  if (gs.reverting >= 0) { gs.listWalls.pop(); }
  gs.listWalls.push(wall);
  gs.reverting = index;

  var steps = elem.getAttribute("data-steps");
  if (steps) {
    gs.nSteps = parseInt(steps) + 1;
  }

  highlightHistory(gs, index);


  Logger.log({type: "history", msg: "revert " + index});
}

/* Render the target state initially. */
window.addEventListener("load", new_target);

function new_target() {
  var index = 0;
  var completedTargets = JSON.parse(util.getStore("completed_targets", "[]"));
  if (completedTargets.length == STATES.length) {
    alert("No more targets.");
    return;
  }
  do {
    index = Math.floor(Math.random()*STATES.length);
  } while (completedTargets.indexOf(index) !== -1 && index !== GS.targetIndex);
  updateTarget(index);
  updateRandomUtterances(GS);
}

function loadGameState(gs, newWall) {
  gs.listWalls = [newWall];
  updateCanvas(gs);
  wipeHistory(gs, newWall);
}
//
// document.getElementById("prev_state").addEventListener("click", function() {
//   var index = document.getElementById("canvastarget").getAttribute("data-index");
//   index--;
//
//   if (index >= 0)
//     updateTarget(index);
// });
//
// document.getElementById("load_state").addEventListener("click", function() {
//   var canvas_target = document.getElementById("canvastarget")
//   var index = canvas_target.getAttribute("data-index");
//   var wall = canvas_target.getAttribute("data-wall");
//   loadGameState(GS, wall);
//   updateStatus("loaded a new state");
// });
//
// document.getElementById("next_state").addEventListener("click", function() {
//   var index = document.getElementById("canvastarget").getAttribute("data-index");
//   index++;
//   if (index != STATES.length) {
//     updateTarget(index);
//   } else {
//     updateTarget(index - 1);
//   }
// });

document.getElementById("clear_button").addEventListener("click", function() {
  GS.nSteps = 1;
  loadGameState(GS, configs.emptyWall);
});

function updateTarget(index) {
  var state = STATES[index];
  var wall = state[1];
  // if (wall == "random")
  //   wall = randomWall();

  PS.Main.renderTargetJSON("[" + wall + "]")();
  GS.targetWall = wall;
  GS.targetIndex = index;
  GS.maxSteps = Math.round(state[0] * 2.5);

  var canvas_target = document.getElementById("canvastarget");
  canvas_target.setAttribute("data-wall", wall);
  canvas_target.setAttribute("data-index", index);
  document.getElementById("possible_steps_n").innerHTML = state[0];
  document.getElementById("max_steps_n").innerHTML = GS.maxSteps;
  document.getElementById("recipe_steps").innerHTML = "(" + 0 + "/" + GS.maxSteps + ")";
}

function randomWall() {
  var wall = "[";
  for (var i = 0; i < 64; i++) {
    var color = Math.floor(Math.random() * 10);
    if (color > 4) color = "";
    wall += "[" + color + "]";
    if (i != 63) wall += ",";
  }
  wall += "]";
  return wall;
}

// document.getElementById("save_state").onclick = function() {
//   var state_name = document.getElementById("state_name");
//   if (state_name.value.length > 0) {
//     saveGameState(GS, state_name.value);
//     state_name.value = "";
//     state_name.className = "";
//   } else {
//     state_name.className = "active";
//   }
// }
//
// document.getElementById("load_state").onclick = function() {
//   var t = document.getElementById("tasks");
//   var name = t.options[t.selectedIndex].value;
//   if (name == "random" || name == "empty") {
//     var taskstr = configs.levels[t.selectedIndex].name;
//     GS.taskind = t.selectedIndex;
//     newWall(GS);
//     updateStatus("selected level {task}"._format({task:taskstr}));
//   } else {
//     var states = JSON.parse(util.store.getItem("states"));
//     updateStatus("selected state {state}"._format({state:name}));
//     for (var i = 0; i < states.length; i++) {
//       if (states[i].name == name) {
//         loadGameState(GS, states[i]);
//         break;
//       }
//     }
//   }
// }

function addPoint(status) {
  var points = util.getStore("points", 0);
  points++;
  GS.incrementSuccessCount(status, 1);
  if (status=="success") {
    points+=10;
    GS.incrementSuccessCount(status, 10);
  }

  util.setStore("points", points);
  document.getElementById("game_points").innerHTML = points;
}

window.addEventListener("load", function() {
  var points = util.getStore("points", 0);
  document.getElementById("game_points").innerHTML = points;
})

// Query stuff

function runCurrentQuery(gs) {
  var querystr = document.getElementById("maintextarea").value.trim()
  document.getElementById("maintextarea").value = ''

  if (querystr.length>0) {
    if (!configs.debugMode && querystr.length > configs.uttLengthLimit) {
      alert("Instruction length is " + querystr.length
	    + " characters. Please limit it to less than "
	    + configs.uttLengthLimit
	    + " characters. Try to define concepts and use those instead of one long instruction.");
      return;
    }
    gs.log.totalTokens += querystr.split(" ").length;
    gs.log.numQueries++;

    logh(gs.numQueries + ' ' + querystr + '; ')
    gs.query = sempre.formatQuery(querystr);
    GameAction.candidates(gs);

    Logger.log({ type: "query", msg: gs.query });

  } else {
    updateStatus("enter a command");
  }
}

var maintextarea = document.getElementById("maintextarea");

function doQuery(e) {
  runCurrentQuery(GS);
  maintextarea.focus();
}

document.getElementById("dobutton").addEventListener("click", doQuery, false);

document.getElementById("prevbutton").onclick = function() {
  GameAction.prev(GS);
  maintextarea.focus();
};
document.getElementById("nextbutton").onclick = function() {
  GameAction.next(GS);
  maintextarea.focus();
};

document.getElementById("flyingaccept").onclick = function() {
  acceptOnclick();
};

function acceptOnclick() {
  // if (GS.tutorialMode) {
  //   if (GS.currentWall == GS.targetWall) {
  //     GameAction.accept(GS);
  //     updateHistory(GS);
  //   } else if (GS.tutorialLevel < 5) {
  //     updateStatus("Woops! That's not exactly right. Try again.");
  //     return;
  //   }
  // }

  if (GS.defineState) {
    alert("You must submit this definition first, then you can accept it!");
    return;
  }

  if (!configs.debugMode && GS.nSteps > GS.maxSteps) {
    alert("You have used the maximum number of steps. Undo some of your steps or clear to start over. You need to build the structure in less than the maxinum number of steps allowed. Try to define more complex phrases and use those rather than being overly specific.");
    return;
  }

  updateHistory(GS);
  GameAction.accept(GS);
  maintextarea.focus();
  Logger.log({type: "metaaction", msg: "accept"});
}
function metaCommand(meta) {
  maintextarea.value = meta;
  maintextarea.focus();
}

document.getElementById("paraphrase").onclick = function() {
  defineInterface(GS);
};

var Hotkeys = {
  ENTER: 13,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  Z : 90,
  D: 68,
  ESC: 27,
};

document.getElementById("maintextarea").onkeydown = function(e) {
  return true;
}

function parseKeys(e) {
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
    redoHistory(GS); e.preventDefault(); return false;
  } else if (e.keyCode == Hotkeys.Z && (e.ctrlKey || e.metaKey)) {
    undoHistory(GS); e.preventDefault(); return false;
  } else if (e.keyCode == Hotkeys.D && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    if (GS.defineState && !(GS.tutorialMode && (GS.tutorialLevel == 7 || GS.tutorialLevel == 12))) {
      closeDefineInterface(GS); return false; }
    defineInterface(GS);
  } else if (e.keyCode == Hotkeys.ESC) {
    e.preventDefault();
    var help_reference = document.getElementById("reference");
    if (help_reference.className == "modal-container") {
      help_reference.className = "modal-container hidden";
    } else if (GS.defineState) {
      closeDefineInterface(GS);
    }
    return true;
  }
}

document.addEventListener("keydown", parseKeys, false);

// Define interface
function definePhrase(e, gs) {
  var definetextarea = document.getElementById("definetextarea");

  if (!configs.debugMode && definetextarea.value.length > configs.defLengthLimit) {
    alert("Definition length is " + definetextarea.value.length + " characters. Please limit it to less than 90 characters. Check out the help page for example commands, or try to define other phrases that would be building blocks to this one.");
    return;
  }

  /* If just trying, update current Wall */
  if (gs.defineSuccess.length == 0 || definetextarea.value != gs.defineSuccess) {
    var cmds = {q: "(uttdef \"" + sempre.formatQuery(definetextarea.value) + "\" -1)", sessionId: gs.sessionId };
    Logger.log({type: "try_define", msg: definetextarea.value });
    sempre.sempreQuery(cmds, function(jsonstr) {
      var jsonparse = JSON.parse(jsonstr);
      var formval = sempre.parseSEMPRE(jsonparse['candidates']);
      var commandResponse = jsonparse['commandResponse'];

      var defCore = commandResponse.indexOf("Core") != -1;
      var defNoCover = commandResponse.indexOf("NoCover") != -1;
      var defNoParse = commandResponse.indexOf("NoParse") != -1;

      if (defCore || defNoCover || defNoParse) {
        gs.define_coverage= jsonparse["coverage"];
        gs.taggedDefineCover = jsonparse["taggedcover"];
        defineInterface(gs, commandResponse);
        addPoint("fail");
      } else {
	gs.defineSuccess = definetextarea.value;
        gs.NBestInd = 0;
        gs.NBest = formval;
        gs.setCurrentWall();
        updateCanvas(gs);
        defineInterface(gs);
        document.getElementById("define_phrase_button").innerHTML = "define";
      }
    });
    return;
  }
  /* If already tried, submit definition */
  //sempre.sempreQuery({q: sempre.formatQuery(gs.query), sessionId: gs.sessionId }, function(jsonstr) {
  //});
  var text = "(uttdef \"" + sempre.formatQuery(gs.defineSuccess) + "\" " + gs.NBest[gs.NBestInd].rank + ")";
  var cmds = {q:text, sessionId:gs.sessionId};
  Logger.log({type: "define", msg: gs.defineSuccess });
  sempre.sempreQuery(cmds, function(jsonstr) {
    var jsonparse = JSON.parse(jsonstr);
    addElemToHistory(gs, document.getElementById("command_history"), ' defined "'
  		       + gs.query + '" as "' + gs.defineSuccess + '"', true);
    closeDefineInterface(gs);
    // consider populate the candidate list quietly,
    //GameAction._candidates(gs);
    gs.currentWall = configs.emptyWall;;
    gs.resetNBest();
    gs.setCurrentWall();
    updateCanvas(gs);
    document.getElementById("maintextarea").value = gs.query;
    updateStatus("definition accepted. thanks for teaching!");
    document.getElementById("show_define_status").className = "hidden";
    document.getElementById("define_phrase_button").innerHTML = "try it";
  });
}

function closeDefineInterface(gs) {
  // probably good to just run the query here

  var definetextarea = document.getElementById("definetextarea");
  var maintextarea = document.getElementById("maintextarea");
  definetextarea.value = "";
  maintextarea.value = "";
  var define_interface = document.getElementById("define_interface");
  define_interface.className = "hidden";

  maintextarea.className = "";
  var mainbuttons = document.getElementById("mainbuttons");
  mainbuttons.className = "buttons";
  maintextarea.focus();
  gs.defineSuccess = "";
  gs.defineState = false;
}

function getColoredSpan(coverage) {
  var colored_query = "";
  for (var i = 0; i < coverage.length; i++) {
    var type = coverage[i][0];
    switch (type) {
      case "$ActionSeq":
        colored_query += "<span class='color-good'>";
        break;
      case "$Action":
        colored_query += "<span class='color-good'>";
        break;
      case "$CondSeq":
        colored_query += "<span class='color-good'>";
        break;
      case "$Cond":
        colored_query += "<span class='color-good'>";
        break;
      case "$NumberSeq":
        colored_query += "<span class='color-good'>";
        break;
      case "$Number":
        colored_query += "<span class='color-good'>";
        break;
      case "$Color":
        colored_query += "<span style='color:blue;'>";
        break;
      case "$Keyword":
        colored_query += "<span style='color:blue;'>";
        break;
      case "$UNK":
        colored_query += "<span style='color:red;'>";
        break;
      default:
        colored_query += "<span style='color:red;'>";
    }
    for (var j = 1; j < coverage[i].length; j++) {
      console.log(coverage[i][j]);
      colored_query += coverage[i][j] + " ";
    }
    colored_query += "</span>";
    console.log(colored_query);
  }
  return colored_query;
}

function defineInterface(gs, status) {
  if (!gs.query) {
    updateStatus("nothing to define, enter a command.");
    return;
  }

  var define_header = document.getElementById("define_header");
  var define_status = document.getElementById("define_status");
  define_status.innerHTML = 'Teach SHRDLURN "' + gs.query + '". ';

  if (!gs.defineState) { // first time openning, or close and open
     if (!gs.noAnswer()) {
      // updateStatus("SHRDLURN already understands " + gs.query + "! Try scrolling too.");
      define_header.innerHTML = "Already understand \""
	+ gs.query + "\", teach another meaning?"
    } else {
      define_header.innerHTML = 'Didn\'t understand "' + getColoredSpan(gs.taggedCover) +'". Please rephrase:';
    }
  } else { // refinement
    if (gs.defineSuccess.length > 0 || gs.tutorialMode) {
      //updateStatus("SHRDLURN understands this!");
      define_header.innerHTML = 'SHRDLURN understands the definition, "' + gs.defineSuccess +'". If this is correct, click "define" to submit the definition.';
    } else {
      //updateStatus("SHRDLURN still does not understand you.");
      define_header.innerHTML = 'Still don\'t understand "' + getColoredSpan(gs.taggedDefineCover) +'". Please rephrase:';
    }

    // handle special status...
    if (status!=undefined) {
      var defCore = status.indexOf("Core") != -1;
      var defNoCover = status.indexOf("NoCover") != -1;
      console.log(status)
      if (defCore) {
	//updateStatus("cannot redefine the core language!");
	define_header.innerHTML = '"' + gs.query + '" is precisely understood, and cannot be redefined by "'+getColoredSpan(gs.taggedDefineCover)+'".';
      }
      else if (defNoCover) {
	//updateStatus("SHRDLRUN cannot learn from this definition");
	define_header.innerHTML = 'Nothing (colors, numbers, etc) in "' + getColoredSpan(gs.taggedDefineCover) + '" matches "' + gs.query
	  + '", so SHRDLURN cannot learn from this.';
      }
    }
  }

  // Hide maintextarea
  var maintextarea = document.getElementById("maintextarea");
  maintextarea.className = "hidden";
  var mainbuttons = document.getElementById("mainbuttons");
  mainbuttons.className = "hidden";

  console.log(gs.coverage);
  // Unhide define interface
  var define_interface = document.getElementById("define_interface");
  define_interface.className = "";
  var definetextarea = document.getElementById("definetextarea");
  definetextarea.placeholder = 'define "' + gs.query + '" here.';
  definetextarea.focus();

  gs.defineState = true;
}

function definePhraseClicked(e) {
  definePhrase(e, GS);
}

// function defineTryClicked(e) {
//   GS.defineSuccess = "";
//   definePhrase(e, GS);
// }

document.getElementById("define_phrase_button").addEventListener("click", definePhraseClicked, false);
//document.getElementById("define_try").addEventListener("click", defineTryClicked, false);
document.getElementById("definetextarea").oninput = function(e) {
  if (GS.defineSuccess.length > 0) {
    document.getElementById("define_phrase_button").innerHTML = "try it";
    GS.defineSuccess = "";
  }
};

document.getElementById("define_instead").addEventListener("click", function(e) {
  e.preventDefault();
  defineInterface(GS);
});
document.getElementById("close_define_interface").addEventListener("click", function(e) {
  if (GS.tutorialMode && (GS.tutorialLevel == 7 || GS.tutorialLevel == 12))
    return;
  closeDefineInterface(GS, false);
});

function simplereset() {
  GS.sessionId = util.getId();
  GS.successCounts = util.getStore("successCounts", {})
  // popTasks();
  newWall(GS);
  document.getElementById("maintextarea").focus();
}

document.getElementById("reset").onclick = function() {
  console.log("resetting!!")
  util.resetStore();
  simplereset();
}

simplereset();

var input = document.getElementById("definetextarea");
var onautocomplete = function(e) {
  if (configs.debugMode) console.log(e);
  if (input.value.endsWith(' '))
    autocomplete(GS, input.value);
  else if (input.value.length == 0)
    autocomplete(GS, "");
  e.stopPropagation();
};
input.addEventListener('input', onautocomplete, false);
input.addEventListener('focus', onautocomplete, false);

// make sure something happens even when autocomplete returns nothing
var awesomplete = new Awesomplete(input,
				  { minChars: 0,
				    list: ["remove if top red", "add yellow",
					   "add brown if has red or row = 3",
					   "add yellow if row = 3",
					   "repeat add yellow 3 times"],
				    filter : function() {return true}
				  });

function autocomplete(gs, prefix) {
  var cmdautocomp = '(autocomplete "' + prefix + '")';
  var cmds = {q:cmdautocomp, sessionId:gs.sessionId};

  sempre.sempreQuery(cmds, function (jsonstr) {
    var autocomps = JSON.parse(jsonstr)['autocompletes'];
    // var wall = jsresp.replace(/\(string /g, '').replace(/\)|\s/g, '');
    if (configs.debugMode)
      console.log("got these suggestions: " + autocomps);
    awesomplete.list = autocomps;
    // call awesomplete
    awesomplete.open();
    awesomplete.evaluate();
  })
}

document.getElementById("reject_button").addEventListener("click", function(e) {
  if (GS.NBest.length == 0) {
    alert("Nothing to reject.");
    return;
  }
  var cmds = {q: "(reject " + GS.NBestInd + ")", sessionId: GS.sessionId};
  sempre.sempreQuery(cmds, function(jsonstr) {
    var jsonparse = JSON.parse(jsonstr);
    GS.NBest.splice(GS.NBestInd, 1);
    GameAction.prev(GS);
  });
});

function completed_target() {
  if (GS.nSteps <= GS.maxSteps) {
    var completed_targets = JSON.parse(util.getStore("completed_targets", "[]"));
    completed_targets.push(GS.targetIndex);
    util.setStore("completed_targets", JSON.stringify(completed_targets));
    document.getElementById("target_completed").className = "modal-container";
  } else {
    alert("You used too many steps to build the target. Undo some steps and try again. Try to define some of the concepts you used and then use them.");
  }
}

document.getElementById("next_target").addEventListener("click", function(e) {
  document.getElementById("target_completed").className = "modal-container hidden";
  //document.getElementById("clear_button").click();
  //new_target();
});

document.getElementById("skip_target").addEventListener("click", function(e) {
  var completedTargets = JSON.parse(util.getStore("completed_targets", "[]"));
  if (completedTargets.length >= STATES.length - 1) {
    alert("No more targets.");
    return;
  }
  new_target();
  GS.skipsLeft--;
  var skip = document.getElementById("skip_target");
  if (GS.skipsLeft <= 0) {
    skip.parentNode.removeChild(skip);
  } else {
    skip.innerHTML = "skip (" + GS.skipsLeft + " left) &rarr;";
  }
  Logger.log({type: "metaaction", msg: "skip"});
});

window.addEventListener("load", function(e) {
  document.getElementById("skip_target").innerHTML = "skip (" + GS.skipsLeft + " left) &rarr;";
});

var Logger = new Logger();
Logger.init(GS);

/**
 * Tutorial
 */

window.addEventListener("load", function() {
  var tutorial_token = util.store.getItem("tutorial_token");
  if (!tutorial_token) {
    begin_tutorial();
  }
});


document.getElementById("start_tutorial2").addEventListener("click", function(e) {
  e.preventDefault();
  begin_tutorial();
  start_tutorial();
});

function begin_tutorial() {
    document.getElementById("tutorial").className = "tutorial active";
    document.getElementById("canvastarget").className = "active";
    document.getElementById("goalblocks").className = "active";
    document.getElementById("quit_tutorial").className = "";
    loadGameState(GS, "[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]");
    PS.Main.renderTargetJSON("[[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,2,2],[4,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,2,2],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]]")();
    GS.tutorialMode = true;
    GS.maxSteps = 100;
    document.getElementById("recipe_steps").innerHTML = "(" + 0 + "/" + GS.maxSteps + ")";
}

function nextTutorial(i) {
  document.getElementById("tutorial-s" + (i - 1)).className = "tutorial-s";
  document.getElementById("tutorial-s" + i).className = "cover-container tutorial-s active";
  GS.tutorialLevel++;
}

document.getElementById("skip_tutorial").onclick = function() {
  util.store.setItem("tutorial_token", "true");
  document.getElementById("tutorial").className = "tutorial";
}

function addCover(id) {
  document.getElementById(id).setAttribute("style", "position:relative;z-index:1000;");
}

function addAbsCover(id) {
  document.getElementById(id).setAttribute("style", "z-index:10000;");
}

function removeCover(id) {
  document.getElementById(id).setAttribute("style", "");
}

document.getElementById("start_tutorial").addEventListener("click", start_tutorial);


function start_tutorial() {
  document.getElementById("tutorial_overlay").className = "";
  document.getElementById("maintextarea").focus();
  addCover("maintextarea");
  addCover("mainbuttons");
  addCover("canvastarget");
  addCover("quit_tutorial");
  nextTutorial(2);
  document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
  window.addEventListener("keydown", keyTutorial);
}

function keyTutorial(e, tutorial_id) {
  if (!GS.tutorialMode)
    return true;

  switch (GS.tutorialLevel) {
    case 3:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 4:
      if (e.keyCode == Hotkeys.ENTER && e.shiftKey)
        prepNextTutorial();
      break;
    case 5:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 6:
      if (e.keyCode == Hotkeys.D && (e.ctrlKey || e.metaKey))
        prepNextTutorial();
      break;
    case 7:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 8:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 9:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 10:
      if (e.keyCode == Hotkeys.ENTER && e.shiftKey)
        prepNextTutorial();
      break;
    case 11:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 12:
      if (e.keyCode == Hotkeys.D && (e.ctrlKey || e.metaKey))
        prepNextTutorial();
      break;
    case 13:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 14:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 15:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 16:
      if (e.keyCode == Hotkeys.ENTER && e.shiftKey)
        prepNextTutorial();
      break;
    default:

  }

  return true;
}

function prepNextTutorial(e) {
  console.log(GS.tutorialLevel);
  switch (GS.tutorialLevel) {
    case 3:
      if (GS.query != "add yellow") {
        alert("Oops! You typed the wrong query. Check your spelling.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(3);
      addCover("canvas");
      addAbsCover("metaactions");
      document.getElementById("flyingaccept").addEventListener("click", prepNextTutorial);
      break;
    case 4:
      document.getElementById("flyingaccept").addEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      nextTutorial(4);
      addCover("maintextarea");
      addCover("mainbuttons");
      document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
      break;
    case 5:
      if (GS.query != "add orange except the border") {
        alert("Oops! You typed the wrong query. Check your spelling.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(5);
      addCover("canvas");
      addAbsCover("metaactions");
      document.getElementById("show_define_status").className = "";
      addAbsCover("show_define_status");
      document.getElementById("paraphrase").addEventListener("click", prepNextTutorial);
      document.getElementById("define_instead").addEventListener("click", prepNextTutorial);
      break;
    case 6:
      document.getElementById("paraphrase").removeEventListener("click", prepNextTutorial);
      document.getElementById("define_instead").removeEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      removeCover("show_define_status");
      nextTutorial(6);
      addCover("define_interface");
      // document.getElementById("define_try").addEventListener("click", prepNextTutorial);
      break;
    case 7:
      if (document.getElementById("definetextarea").value != "add orange if row > 1 and col > 1 and row < 8 and col < 8") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      addCover("canvas");
      //document.getElementById("define_try").removeEventListener("click", prepNextTutorial);
      nextTutorial(7);
      document.getElementById("define_phrase_button").addEventListener("click", prepNextTutorial);
      break;
    case 8:
      if (document.getElementById("definetextarea").value != "add orange if row > 1 and col > 1 and row < 8 and col < 8") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("definetextarea").value = "";
      document.getElementById("define_phrase_button").removeEventListener("click", prepNextTutorial);
      removeCover("define_interface");
      removeCover("canvas");
      closeDefineInterface(GS);
      updateStatus("definition accepted. thanks for teaching!");
      nextTutorial(8);
      addCover("maintextarea");
      addCover("mainbuttons");
      document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
      break;
    case 9:
      if (GS.query != "add orange except the border") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(9);
      addCover("canvas");
      addAbsCover("metaactions");
      document.getElementById("flyingaccept").addEventListener("click", prepNextTutorial);
      break;
    case 10:
      document.getElementById("flyingaccept").removeEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      nextTutorial(10);
      addCover("maintextarea");
      addCover("mainbuttons");
      document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
      break;
    case 11:
      if (GS.query != "add 2 red if col  =  4 or col  =  5") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(11);
      addCover("canvas");
      addAbsCover("metaactions");
      addAbsCover("show_define_status");
      document.getElementById("paraphrase").addEventListener("click", prepNextTutorial);
      document.getElementById("define_instead").addEventListener("click", prepNextTutorial);
      break;
    case 12:
      document.getElementById("paraphrase").removeEventListener("click", prepNextTutorial);
      document.getElementById("define_instead").removeEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      removeCover("show_define_status");
      nextTutorial(12);
      addCover("define_interface");
      // document.getElementById("define_try").addEventListener("click", prepNextTutorial);
      break;
    case 13:
      if (document.getElementById("definetextarea").value != "repeat add red if col = 4 or col = 5 2 times") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      addCover("canvas");
      // document.getElementById("define_try").removeEventListener("click", prepNextTutorial);
      nextTutorial(13);
      document.getElementById("define_phrase_button").addEventListener("click", prepNextTutorial);
      break;
    case 14:
      if (document.getElementById("definetextarea").value != "repeat add red if col = 4 or col = 5 2 times") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("definetextarea").value = "";
      document.getElementById("define_phrase_button").removeEventListener("click", prepNextTutorial);
      removeCover("define_interface");
      removeCover("canvas");
      closeDefineInterface(GS);
      updateStatus("definition accepted. thanks for teaching!");
      nextTutorial(14);
      addCover("maintextarea");
      addCover("mainbuttons");
      document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
      break;
    case 15:
      if (!(GS.query == "add 2 red if col  =  4 or col  =  5" || GS.query == "add 2 red if col   =   4 or col   =   5")) {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(15);
      addCover("canvas");
      addAbsCover("metaactions");
      document.getElementById("flyingaccept").addEventListener("click", prepNextTutorial);
      break;
    case 16:
      document.getElementById("flyingaccept").removeEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      removeCover("quit_tutorial");
      window.removeEventListener("keydown", keyTutorial);
      document.getElementById("tutorial_overlay").className = "hidden";
      document.getElementById("tutorial-s15").className = "tutorial-s";
      document.getElementById("tutorial-s16").className = "modal-container tutorial-s active";
      GS.tutorialLevel++;
      break;
    default:
  }
  return true;
}


document.getElementById("quit_tutorial").addEventListener("click", function() {
  finishTutorial();
});

function finishTutorial() {
  util.store.setItem("tutorial_token", true);
  document.getElementById("tutorial").className = "tutorial";
  document.getElementById("canvastarget").className = "";
  document.getElementById("goalblocks").className = "";
  removeCover("quit_tutorial");
  document.getElementById("quit_tutorial").className = "hidden";
  GS.tutorialMode = false;
  document.getElementById("clear_button").click();
  new_target();
}

document.getElementById("finish_tutorial").onclick = function() {
  finishTutorial();
}

var reference_links = document.getElementsByClassName("reference_link");
for (var i = 0; i < reference_links.length; i++) {
  reference_links[i].addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("reference").className = "modal-container";
  });
}

document.getElementById("reference_close").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("reference").className = "modal-container hidden";
});

var turk = {};
(function(exports) {
  "use strict";

  var XORCipher = {
    encode: function(key, data) {
      data = xor_encrypt(key, data);
      return b64_encode(data);
    },
    decode: function(key, data) {
      data = b64_decode(data);
      return xor_decrypt(key, data);
    }
  };

  var b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  function b64_encode(data) {
    var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
    if (!data) { return data; }
    do {
      o1 = data[i++];
      o2 = data[i++];
      o3 = data[i++];
      bits = o1 << 16 | o2 << 8 | o3;
      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;
      enc += b64_table.charAt(h1) + b64_table.charAt(h2) + b64_table.charAt(h3) + b64_table.charAt(h4);
    } while (i < data.length);
    r = data.length % 3;
    return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
  }

  function b64_decode(data) {
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
    if (!data) { return data; }
    data += "";
    do {
      h1 = b64_table.indexOf(data.charAt(i++));
      h2 = b64_table.indexOf(data.charAt(i++));
      h3 = b64_table.indexOf(data.charAt(i++));
      h4 = b64_table.indexOf(data.charAt(i++));
      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
      o1 = bits >> 16 & 0xff;
      o2 = bits >> 8 & 0xff;
      o3 = bits & 0xff;
      result.push(o1);
      if (h3 !== 64) {
	result.push(o2);
	if (h4 !== 64) {
	  result.push(o3);
	}
      }
    } while (i < data.length);
    return result;
  }

  function keyCharAt(key, i) {
    return key.charCodeAt( Math.floor(i % key.length) );
  }

  function xor_encrypt(key, data) {
    return _.map(data, function(c, i) {
      return c.charCodeAt(0) ^ keyCharAt(key, i);
    });
  }
  
  function xor_decrypt(key, data) {
    return _.map(data, function(c, i) {
      return String.fromCharCode( c ^ keyCharAt(key, i) );
    }).join("");
  }
  exports.XORCipher = XORCipher;
}(turk));
turk.page = "turkube.html";
turk.token = function (gs) {
  var mturkid = util.parseQueryString()["mturkid"];
  var tokeninfo = {m:mturkid, c:gs.getLastWall().indexOf(gs.targetWall),  d:util.hashCode(gs.getLastWall().toString()), q:gs.log.numQueries}
  var token = turk.XORCipher.encode(turk.page, JSON.stringify(tokeninfo).replace(/\"/g, "")+"||||||||")
  return token;
};
turk.test = function(){return turk.XORCipher.decode(turk.page, turk.token(GS))}
document.getElementById("turkbutton").onclick = function() {
  var turkcode = document.getElementById("turkcode")
  var score = _.reduce(_.map(GS.successCounts, function(num, key){ return num; }), function(a,b){return parseInt(a)+parseInt(b)}, 0);
  if(GS.getLastWall().indexOf(GS.targetWall)==0) {
    turkcode.innerHTML = turk.token(GS);
  } else {
    turkmsg.innerHTML = "you will get the code after you complete the target (you will see a message when you do that)"
  }
}

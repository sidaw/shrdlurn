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
    for( var i=0; i < 7; i++ )
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

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
    var tokeninfo = {id:mturkid, eB:gs.extraBits.toFixed(2),
		     sc:_.map(GS.successCounts, function(num, key){ return num; }),
		     log:gs.log}
    var token = turk.XORCipher.encode(turk.page, JSON.stringify(tokeninfo))
    return token;
};
document.getElementById("turker").style.display="block";
turk.test = function(){return turk.XORCipher.decode(turk.page, turk.token(GS))}

document.getElementById("turkbutton").onclick = function() {
    var turkcode = document.getElementById("turkcode")
    var score = _.reduce(_.map(GS.successCounts, function(num, key){ return num; }), function(a,b){return parseInt(a)+parseInt(b)}, 0);
    if(score >= 45) {
	turkcode.innerHTML = turk.token(GS);
	if(score >= 49)
	    turkmsg.innerHTML = "Thanks for completing this task, please paste the code back!"
	else
	    turkmsg.innerHTML = "You are almost done!"
    } else if (score > 30) {
	turkcode.innerHTML = turk.token(GS);
	turkmsg.innerHTML = "it seems you've made some progress, and here is the code, but we are likely to reject your answer. keep trying!"
    } else {
	turkmsg.innerHTML = "you will only get the code if you are done or made sufficient progress."
    }
}

// jack the simpleid function when mturkid is present
if (util.parseQueryString()["mturkid"]) {
    util.getId = function()
    {
	return util.parseQueryString()["mturkid"];
    }
}

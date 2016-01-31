// module Sempre

exports.wallFromJSON = function (datastr) {
    return function() {
	console.log(datastr)
	data = just(JSON.parse(data));
	console.log(data)
        return data
    };
};

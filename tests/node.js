const Uuidy = require('../dis/uuidy.js');

Promise.resolve().then(function () {
	return Uuidy.four();
}).then(function (uuid) {
	console.log(uuid);
}).catch(function (error) {
	console.error(error);
});

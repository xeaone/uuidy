'use strict';

const Util = require('util');
const Crypto = require('crypto');

const RandomBytes = Util.promisify(Crypto.randomBytes);

module.exports = {

	four: async function () {
		let bytes = await RandomBytes(16);

		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;

		bytes = bytes.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);

		bytes.shift();

		return bytes.join('-');
	},

	fourSync: function () {
		let bytes = Crypto.randomBytes(16);

		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;

		bytes = bytes.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);

		bytes.shift();

		return bytes.join('-');
	}

};

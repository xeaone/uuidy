let RandomBytes;
let RandomBytesSync;

let BufferToHex;
let BufferToHexSync;

if (typeof window === 'undefined') {

	const Util = require('util');
	const Crypto = require('crypto');

	RandomBytesSync = Crypto.randomBytes;
	RandomBytes = Util.promisify(Crypto.randomBytes);

	BufferToHex = function (buffer) {
        return Promise.resolve(buffer.toString('hex'));
	};

	BufferToHexSync = function (buffer) {
		return buffer.toString('hex');
	};

} else {

	const randomBytes = function (size) {
		const bytes = new Uint8Array(size);
		const values = window.crypto.getRandomValues(bytes);
		return values.buffer;
	};

	const bufferToHex = function (buffer) {
		const bytes = new Uint8Array(buffer);
		const hexes = [];

		for (let i = 0, l = bytes.length; i < l; i++) {

			let hex = bytes[i].toString(16);
			let pad = ('00' + hex).slice(-2);

			hexes.push(pad);
		}

		return hexes.join('');
	};

	RandomBytes = function (size) {
        return Promise.resolve().then(randomBytes.bind(this, size));
	};

	BufferToHex = function (buffer) {
		return Promise.resolve().then(bufferToHex.bind(this, buffer));
	};

	RandomBytesSync = randomBytes;
	BufferToHexSync = bufferToHex;

}

export default {

	four () {
		return Promise.resolve().then(function () {
		    return RandomBytes(16);
		}).then(function (bytes) {
		    bytes[6] = (bytes[6] & 0x0f) | 0x40;
		    bytes[8] = (bytes[8] & 0x3f) | 0x80;
		    return BufferToHex(bytes);
        }).then(function (bytes) {
            bytes = bytes.match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
		    bytes.shift();
		    return bytes.join('-');
        });
	},

	fourSync () {
		let bytes = RandomBytesSync(16);

		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;

		bytes = BufferToHexSync(bytes).match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);

		bytes.shift();

		return bytes.join('-');
	}

};


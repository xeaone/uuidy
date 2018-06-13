/*
	Name: uuidy
	Version: 1.1.2
	License: MPL-2.0
	Author: Alexander Elias
	Email: alex.steven.elias@gmail.com
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
	(typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('Uuidy', factory) : global.Uuidy = factory();
})(this, function () {
	'use strict';

	var RandomBytes = void 0;
	var RandomBytesSync = void 0;

	var BufferToHex = void 0;
	var BufferToHexSync = void 0;

	if (typeof window === 'undefined') {

		var Util = require('util');
		var Crypto = require('crypto');

		RandomBytesSync = Crypto.randomBytes;
		RandomBytes = Util.promisify(Crypto.randomBytes);

		BufferToHex = function BufferToHex(buffer) {
			return Promise.resolve(buffer.toString('hex'));
		};

		BufferToHexSync = function BufferToHexSync(buffer) {
			return buffer.toString('hex');
		};
	} else {

		var randomBytes = function randomBytes(size) {
			var bytes = new Uint8Array(size);
			var values = window.crypto.getRandomValues(bytes);
			return values.buffer;
		};

		var bufferToHex = function bufferToHex(buffer) {
			var bytes = new Uint8Array(buffer);
			var hexes = [];

			for (var i = 0, l = bytes.length; i < l; i++) {

				var hex = bytes[i].toString(16);
				var pad = ('00' + hex).slice(-2);

				hexes.push(pad);
			}

			return hexes.join('');
		};

		RandomBytes = function RandomBytes(size) {
			return Promise.resolve().then(randomBytes.bind(this, size));
		};

		BufferToHex = function BufferToHex(buffer) {
			return Promise.resolve().then(bufferToHex.bind(this, buffer));
		};

		RandomBytesSync = randomBytes;
		BufferToHexSync = bufferToHex;
	}

	var uuidy = {
		four: function four() {
			return Promise.resolve().then(function () {
				return RandomBytes(16);
			}).then(function (bytes) {
				bytes[6] = bytes[6] & 0x0f | 0x40;
				bytes[8] = bytes[8] & 0x3f | 0x80;
				return BufferToHex(bytes);
			}).then(function (bytes) {
				bytes = bytes.match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
				bytes.shift();
				return bytes.join('-');
			});
		},
		fourSync: function fourSync() {
			var bytes = RandomBytesSync(16);

			bytes[6] = bytes[6] & 0x0f | 0x40;
			bytes[8] = bytes[8] & 0x3f | 0x80;

			bytes = BufferToHexSync(bytes).match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);

			bytes.shift();

			return bytes.join('-');
		}
	};

	return uuidy;
});
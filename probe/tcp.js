"use strict";

const result = require("../result");
const net = require("net");

exports.run = function(config) {
	config.name = `TCP ${config.host}:${config.port}`;

	return new Promise(resolve => {
		let socket = net.connect(config.port, config.host);

		socket.setTimeout(config.timeout, () => {
			resolve(result.createTimeoutFailure(config));
			socket.destroy();
		});

		socket.on("connect", () => {
			resolve(result.createSuccess(config));
			socket.destroy();
		});

		socket.on("error", e => {
			resolve(result.createFailure(config, e));
		});
	});
}


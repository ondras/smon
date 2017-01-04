/* Sends an ICMP probe. Requires both `ping` and `timeout` binaries in your $PATH. */

"use strict";

const result = require("../result");
const exec = require("child_process").exec;

exports.run = function(config) {
	config.name = `PING ${config.host}`;

	return new Promise(resolve => {
		let timeout = config.timeout / 1000;
		exec(`timeout ${timeout}s ping -c 1 ${config.host}`, e => {
			let r;
			if (e) {
				if (e.code == 124) {
					r = result.createTimeoutFailure(config);
				} else {
					r = result.createFailure(config, e);
				}
			} else {
				r = result.createSuccess(config);
			}
			resolve(r);
		});
	});
}


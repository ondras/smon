"use strict";

const tls = require("tls");
const result = require("../result");

exports.run = function(config) {
	config.name = `Certificate for ${config.host}:${config.port}`;
	return new Promise(resolve => {
		let options = {
			host: config.host,
			servername: config.host, // SNI
			port: config.port,
			rejectUnauthorized: false
		};
		
		let socket = tls.connect(options);
		socket.on("secureConnect", () => {
			let r = null;
			let cert = socket.getPeerCertificate();
//console.log(cert);
			if (!socket.authorized) {
				r = result.createFailure(config, {authorized:false, subject: cert.subject});
			} else if (config.validDays) {
				let now = new Date();
				let to = new Date(cert.valid_to);
				let days = (to - now) / (1000 * 60 * 60 * 24);
				if (days < config.validDays) {
					r = result.createFailure(config, {days});
				}
			}

			if (!r) { r = result.createSuccess(config); }
			socket.destroy();
			resolve(r);
		});

		socket.on("error", e => {
			resolve(result.createFailure(config, e));
		});

		socket.setTimeout(config.timeout, () => {
			resolve(result.createTimeoutFailure(config));
		});
	});
}


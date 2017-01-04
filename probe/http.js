"use strict";

const http = require("http");
const https = require("https");
const result = require("../result");

exports.run = function(config) {
	config.name = `HTTP ${config.url}`;

	let provider = (config.url.match(/^https/i) ? https : http);
	return new Promise(resolve => {
		let data = "";

		let request = provider.get(config.url, response => {
			let status = response.statusCode;
			if ("status" in config && config.status != status) {
				resolve(result.createFailure(config, {status}));
			}
			
			response.on("data", chunk => data += chunk);

			response.on("end", () => {
				if ("size" in config && data.length < config.size) {
					resolve(result.createFailure(config, {size:data.length}));
				}
				resolve(result.createSuccess(config));
			});
		});

		request.setTimeout(config.timeout, () => {
			resolve(result.createTimeoutFailure(config));
		});

		request.on("error", e => {
			resolve(result.createFailure(config, e));
		});
	});
}


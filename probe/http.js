"use strict";

const http = require("http");
const https = require("https");
const result = require("../result");
const url = require("url");

exports.run = function(config) {
	config.name = `HTTP ${config.url}`;
	let parsed = url.parse(config.url);

	let options = {
		hostname: parsed.hostname,
		path: parsed.path
	}
	if (parsed.port) { options.port = parsed.port; }
	if (config.method) { options.method = config.method; }
	if (config.auth) { options.auth = config.auth; }
	if (config.headers) { options.headers = config.headers; }

	let provider = (parsed.protocol == "https:" ? https : http);
	return new Promise(resolve => {
		let data = "";

		let request = provider.request(options, response => {
			let status = response.statusCode;
			if ("status" in config && config.status != status) {
				resolve(result.createFailure(config, {status}));
			}
			
			response.on("data", chunk => data += chunk);

			response.on("end", () => {
				if ("size" in config && data.length < config.size) {
					resolve(result.createFailure(config, {size:data.length}));
				}
				resolve(result.createSuccess(config, data));
			});
		});

		request.setTimeout(config.timeout, () => {
			request.abort();
			resolve(result.createTimeoutFailure(config));
		});

		request.on("error", e => {
			resolve(result.createFailure(config, e));
		});

		request.end(config.data || "");
	});
}


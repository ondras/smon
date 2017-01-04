/* Report failing probes via a HTTP request */

"use strict";

const format = require("../format");
const http = require("http");
const https = require("https");
const url = require("url");

exports.run = function(failures, successes, config) {
	if (!failures.length) { return; }

	let data = [];

	failures.forEach(failure => {
		let lines = format.result(failure, false);
		data = data.concat(lines);
	});

	let provider = (config.url.match(/^https/i) ? https : http);
	let u = `${config.url}${encodeURIComponent(data.join(", "))}`;
	let options = url.parse(u);
	options.method = config.method;
	let request = provider.request(options, response => {
		console.log(response);
	});

	request.on("error", e => console.error(e));
	request.end();
}


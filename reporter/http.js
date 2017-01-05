/* Report failing probes via a HTTP request */

"use strict";

const format = require("../format");
const http = require("http");
const https = require("https");
const url = require("url");
const template = `Failing probes: {{failed-names}}`;

exports.run = function(results, config) {
	let failures = results.filter(r => r.type == "failure");
	if (!failures.length) { return; }

	let str = format.template(config.template || template, results);
	let u = `${config.url}${encodeURIComponent(str)}`;
	let options = url.parse(u);
	options.method = config.method; // FIXME POST data

	let provider = (config.url.match(/^https/i) ? https : http);
	let request = provider.request(options, response => {});

	request.on("error", e => console.error(e));
	request.end();
}


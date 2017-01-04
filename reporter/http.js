/* Report failing probes via a HTTP request */

"use strict";

const format = require("../format");
const http = require("http");
const https = require("https");

exports.run = function(failures, successes, config) {
	if (!failures.length) { return; }

	let provider = (config.url.match(/^https/i) ? https : http);

	
	console.log("Failing probes:");
	failures.forEach(failure => {
		let lines = format.result(failure, config.verbose);
		lines.forEach(line => console.log(`\t${line}`));
		console.log("");
	});
}


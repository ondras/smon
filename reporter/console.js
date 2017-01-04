"use strict";

const format = require("../format");

exports.run = function(failures, successes, config) {
	console.log("%s probe(s) failed (and %s probe(s) succeeded)", failures.length, successes.length);
	if (!failures.length) { return; }
	
	console.log("Failing probes:");
	failures.forEach(failure => {
		let lines = format.result(failure, config.verbose);
		lines.forEach(line => console.log(`\t${line}`));
		console.log("");
	});
}


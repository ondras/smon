"use strict";

exports.run = function(results, config) {
	let failures = results.filter(r => r.type == "failure");
	if (failures.length > 0) { process.exitCode = 1; }
}


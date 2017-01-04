"use strict";

exports.run = function(failures, successes, config) {
	if (failures.length > 0) { process.exitCode = 1; }
}


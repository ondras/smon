"use strict";

exports.result = function(result, verbose) {
	let lines = [];
	lines.push(result.probe.name);

	if (verbose) {
		lines.push(`\tProbe data: ${JSON.stringify(result.probe)}`);
		lines.push(`\tError data: ${JSON.stringify(result.data)}`);
	}

	return lines;
}

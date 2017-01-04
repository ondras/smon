/* Reports failed probes via sendmail. Requires some `sendmail` binary in your $PATH. */

"use strict";

const exec = require("child_process").exec;
const format = require("../format");

exports.run = function(failures, successes, config) {
	if (!failures.length) { return; }

	let lines = [];
	if (config.from) { lines.push(`From: ${config.from}`); }
	
	[].concat(config.to).forEach(to => {
		lines.push(`To: ${to}`);
	});
	
	[].concat(config.cc).forEach(cc => {
		lines.push(`Cc: ${cc}`);
	});

	if (config.subject) { lines.push(`Subject: ${config.subject}`); }

	lines.push("Failed probes:");

	failures.forEach(failure => {
		format.result(failure, config.verbose).forEach(line => lines.push(`\t${line}`));
		lines.push("");
	});

	let child = exec("sendmail -t");
	child.stdin.write(lines.join("\n"));
	child.stdin.end();
}


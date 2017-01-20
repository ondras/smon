/* Reports failed probes via sendmail. Requires some `sendmail` binary in your $PATH. */

"use strict";

const exec = require("child_process").exec;
const format = require("../format");
const template = `Failed probes:

{{failed-verbose}}`;

exports.run = function(results, config) {
	let failures = results.filter(r => r.type == "failure");
	if (!failures.length) { return; }

	let lines = [];
	if (config.from) { lines.push(`From: ${config.from}`); }
	
	[].concat(config.to || []).forEach(to => {
		lines.push(`To: ${to}`);
	});
	
	[].concat(config.cc || []).forEach(cc => {
		lines.push(`Cc: ${cc}`);
	});

	if (config.subject) { lines.push(`Subject: ${config.subject}`); }

	let str = format.template(config.template || template, results);
	let data = `${lines.join("\n")}\n${str}`;

	let child = exec("sendmail -t", {}, e => e && console.log(e));
	child.stdin.on("error", console.log);
	child.stdin.write(data);
	child.stdin.end();
}


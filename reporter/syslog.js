/* Report failed probes to a system log */

"use strict";

const exec = require("child_process").exec;
const format = require("../format");
const template = `[smon] failed probes: {{failed-names}}`;

exports.run = function(results, config) {
	let failed = results.filter(r => r.type == "failure");
	if (!failed.length) { return; }
	let str = format.template(template, results);

	let priority = "";
	if (config.priority) { priority = `-p ${config.priority}`; }

	let child = exec(`logger ${priority} ${str}`);
}


/* Report failed probes to a system log */

"use strict";

const exec = require("child_process").exec;
const format = require("../format");
const template = `[smon] failed probes: {{failed-names}}\n[smon] successful probes: {{succeeded-names}}`;

exports.run = function(results, config) {
	let str = format.template(config.template || template, results);

	let priority = "";
	if (config.priority) { priority = `-p ${config.priority}`; }
	
	str.split("\n").forEach(str => {
		let child = exec(`logger ${priority} "${str}"`);
	});
}


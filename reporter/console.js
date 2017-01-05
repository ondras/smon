"use strict";

const format = require("../format");
const template = `{{failed-count}} probes(s) failed (and {{succeeded-count}} succeeded)

Failing probes:
{{failed-verbose}}`;

exports.run = function(results, config) {
	let str = format.template(config.template || template, results);
	console.log(str);
}


"use strict";

exports.template = function(template, results) {
	let replacements = {};

	let succeeded = results.filter(r => r.type == "success");
	let failed = results.filter(r => r.type == "failure");

	replacements["succeeded-count"] = succeeded.length;
	replacements["failed-count"] = failed.length;

	replacements["succeeded-names"] = succeeded.map(r => `${r.probe.name} (${r.time}ms)`).join(", ");
	replacements["failed-names"] = failed.map(r => r.probe.name).join(", ");

	replacements["succeeded-verbose"] = succeeded.map(r => {
		return `${r.probe.name}
\tProbe data: ${JSON.stringify(r.probe)}
\tResult: ${r.result}
\tTime: ${r.time}`;
	}).join("\n");


	replacements["failed-verbose"] = failed.map(r => {
		return `${r.probe.name}
\tProbe data: ${JSON.stringify(r.probe)}
\tError data: ${JSON.stringify(r.data)}`;
	}).join("\n");
	
	return template.replace(/{{([a-z-]+)}}/g, (match, key) => replacements[key]);
}


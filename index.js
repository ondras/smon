"use strict";

const result = require("./result");

const probes = [];
const reporters = [];
const config = {
	timeout: 1000,
	verbose: true
};

process.on("unhandledRejection", e => {
	process.stderr.write(`Unhandled rejection: ${e.message}`);
	process.exitCode = 2;
});

function runProbe(probe) {
	// merge timeout with probe options
	if (!("timeout" in probe)) { probe.timeout = config.timeout; }

	try {
		return require(`./probe/${probe.type}`).run(probe);
	} catch (e) {
		return Promise.resolve(result.createFailure(probe, e));
	}
}

function runReporter(reporter, failures, successes) {
	// merge verbosity with reporter options
	if (!("verbose" in reporter)) { reporter.verbose = config.verbose; }

	return require(`./reporter/${reporter.type}`).run(failures, successes, reporter);
}

exports.addProbe = function(probe) {
	probes.push(probe);
}

exports.addReporter = function(reporter) {
	reporters.push(reporter);
}

exports.configure = function(cfg) {
	Object.assign(config, cfg);
}

try {
	require("fs").readdirSync(`${__dirname}/conf`).forEach(file => {
		require(`./conf/${file}`);
	});
} catch (e) {}

if (!probes.length) {
	console.log("No configuration found, exiting.\n\nPut some files into the conf/ directory -- or, better yet, put them elsewhere and symlink them to conf/.");
}

Promise.all(probes.map(runProbe)).then(results => {
	let successes = results.filter(r => r.type == "success");
	let failures = results.filter(r => r.type == "failure");
	reporters.forEach(reporter => runReporter(reporter, failures, successes));
});

"use strict";

const result = require("./result");

const probes = [];
const reporters = [];
const config = {
	timeout: 5000
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
		console.log(e);
		return Promise.resolve(result.createFailure(probe, e));
	}
}

function runReporter(reporter, results) {
	return require(`./reporter/${reporter.type}`).run(results, reporter);
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
} catch (e) {
	console.log("The `conf/` subdirectory does not exist or is not readable.", e);
}

if (!probes.length) {
	console.log("No configuration found, exiting.\n\nPut some files into the conf/ directory -- or, better yet, put them elsewhere and symlink them to conf/.");
}

Promise.all(probes.map(runProbe)).then(results => {
	reporters.forEach(reporter => runReporter(reporter, results));
});

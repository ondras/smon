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

function runProbeOnce(probe, conf) {
	let ts = Date.now();
	try {
		return probe.run(conf).then(result => {
			result.time = Date.now() - ts;
			return result;
		});
	} catch (e) {
		console.log(e);
		return Promise.resolve(result.createFailure(conf, e));
	}
}

function runProbe(probeConf) {
	if (!("timeout" in probeConf)) { probeConf.timeout = config.timeout; } // merge timeout with probe options

	let attempts = probeConf.attempts || config.attempts || 1;
	let probe;

	try {
		probe = require(`./probe/${probeConf.type}`);
	} catch (e) {
		console.log(e);
		return Promise.resolve(result.createFailure(probeConf, e));
	}

	function runWithRetry() {
		return runProbeOnce(probe, probeConf).then(result => {
			if (result.type == "failure" && result.data.timeout && attempts > 1) {
				attempts--;
				return runWithRetry();
			} else {
				return result;
			}
		});
	}

	return runWithRetry();
}

function runReporter(reporter, results) {
	return require(`./reporter/${reporter.type}`).run(results, reporter);
}

exports.addProbe = function(probe) { probes.push(probe); }
exports.addReporter = function(reporter) { reporters.push(reporter); }
exports.configure = function(cfg) { Object.assign(config, cfg); }

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

exports.createFailure = function(probe, data) {
	return {
		type: "failure",
		probe,
		data
	}
}

exports.createTimeoutFailure = function(probe) {
	return exports.createFailure(probe, {timeout:probe.timeout});
}

exports.createSuccess = function(probe) {
	return {
		type: "success",
		probe
	}
}


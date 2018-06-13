module.exports = function(cmd, result, callback){

	let checks = {
		type: cmd,
		total: 0,
		passes: 0,
		failed: 0,
	};

	let resultObj = {};

	try {
		resultObj = JSON.parse(result.stdout);
	} catch (err) {
		console.log("Error in parsing result output for mocha check summary ", err);
		resultObj = {};
	}

	if(resultObj && resultObj.stats) {
		checks.total  = resultObj.stats.tests - resultObj.stats.pending;
		checks.passes = resultObj.stats.passes;
		checks.failed = resultObj.stats.failures;
	}

	let summary = {checks};
	result.summary = JSON.stringify(summary);

	callback(null, result);
}
module.exports = function(cmd, result, callback){
	let checks = {
		type: cmd,
		tests: 0,
		errors: 0,
		skipped: 0,
		fails: 0,
		pass : 0,
		total: 0,
		passes: 0,
		failed: 0
	};

	let resultObj = {};

	try {
		if(result.stdout)
			resultObj = JSON.parse(result.stdout);
	} catch (err) {
		console.log("Error in parsing result output for junit check summary ", err);
		resultObj = {};
	}

	if(resultObj && resultObj.stats) {
		resultObj.stats.map((scores)=>{
			checks.tests  += parseInt(scores.tests);
			checks.errors += parseInt(scores.errors);
			checks.skipped += parseInt(scores.skipped);
			checks.fails += parseInt(scores.failures);
		})
		checks.total = checks.tests;
		checks.passes = checks.tests - checks.fails - checks.errors - checks.skipped;
		checks.failed = checks.fails + checks.errors;
	}

	let summary = {checks};
	result.summary = JSON.stringify(summary);
	callback(null, result);
}

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
			checks.tests  = parseInt(scores.total);
			checks.errors = parseInt(scores.error);
			checks.skipped = parseInt(scores.pending);
			checks.fails = parseInt(scores.failed);
			checks.pass = parseInt(scores.passed);
		})
		checks.total = checks.tests;
		checks.passes = checks.pass;
		checks.failed = checks.fails + checks.errors + checks.skipped;
	}
	let summary = {checks};
	result.summary = JSON.stringify(summary);
	callback(null, result);
}

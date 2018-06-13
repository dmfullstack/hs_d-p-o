module.exports = function(cmd, result, callback){
	let checks = {
		type: cmd,
		total: 0,
		passes: 0,
		failed: 0,
	};

	let resultObj = undefined;

	try {
		if(result.stdout)
		  resultObj = JSON.parse(result.stdout);
	} catch (err) {
		console.log("Error in parsing result output for pmd check summary ", err);
		resultObj = undefined;
	}

	if(resultObj) {
		checks.total = 70;
		checks.passes = Math.abs(20 - resultObj.length);
		checks.failed = resultObj.length;
	}

	let summary = {checks};
	result.summary = JSON.stringify(summary);

	callback(null, result);
}

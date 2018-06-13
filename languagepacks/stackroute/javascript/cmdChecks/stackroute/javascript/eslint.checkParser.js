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
		console.log("Error in parsing result output for eslint check summary ", err);
		resultObj = {};
	}

	if(resultObj) {
		checks.total = 133;
		checks.passes = Math.abs(133 - resultObj.length);
		checks.failed = resultObj.length;
	}

	let summary = {checks};
	result.summary = JSON.stringify(summary);

	callback(null, result);
}

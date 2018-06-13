module.exports = function(cmd, result, callback){

	let checks = {
		type: cmd,
		total: 0,
		passes: 0,
		failed: 0,
	};

	let resultObj = {};

	try {
		if(result.stdout){
			resultObj = JSON.parse(result.stdout);
		}
	} catch (err) {
		console.log("Error in parsing result output for mocha check summary ", err);
		resultObj = {};
	}

  if (resultObj && resultObj.summary) {
    checks.total = resultObj.summary.tests;
    checks.passes = resultObj.summary.passed;
    checks.failed = resultObj.summary.failed;
  }

  // Ignoring this, as this was not accurate due to XML parsing
/*	if(resultObj && resultObj.stats) {
		checks.total  = resultObj.stats.tests
		checks.passes = resultObj.stats.tests - resultObj.stats.failures;
		checks.failed = resultObj.stats.failures;
	}
*/
	let summary = {checks};
	result.summary = JSON.stringify(summary);

	callback(null, result);
}

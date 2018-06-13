const lodash = require('lodash');

function isEmpty (val) {
 return lodash.isEmpty(val) ? true : lodash.isEmpty(val.trim());
}

module.exports = function({exitCode, stdout, stderr, testout } , callback){
	let stdOUT = stdout;
	let stdERR = stderr;
	let testOUT = testout;
	let transformedOutput = {};
	
	let testCasesArray = [];
	let scores = [];

	if(!stdERR) stdERR = "";

	if(!testOUT || !(Array.isArray(testOUT) || !testOUT.length > 0) ) {
	stdERR += `[** ERROR **] Unable to parse test output, please check and try, LOG::${ (isEmpty(stderr) ? stdout : stderr) }`;
    callback(null, { exitCode: exitCode, stdout: testout, stderr: stdERR, log: stdout });
    return;
  }

	testOUT.forEach((path) => {
		path.TestRun.ResultSummary.forEach((suites) => {
			suites.Counters.forEach((attr) => {
				scores.push(attr.attributes);
			});
		});
		path.TestRun.Results.forEach((suites) => {
			suites.UnitTestResult.forEach((test) => {               
				let tests = {
					duration: test.attributes.endTime,
					fullTitle: test.attributes.testName,
					title: test.attributes.testName
				}

				if(test.Output){
					fails = test.Output.forEach((failure) => {
						let error = {
							type: 'error'
						}
						failure.ErrorInfo.forEach((msg) => {
							msg.Message.forEach((message) => {
								error.message = message.replace(/\n/g,'');
							})
						})
						tests.err = error;
					})
				}
				testCasesArray.push(tests);
			})
		})
	})

	transformedOutput.tests = testCasesArray;
	transformedOutput.stats = scores;

	testOUT = JSON.stringify(transformedOutput);

	if (stdERR) {
		stdERR = stdERR.replace(/(\r\n|\n|\r|\t)/gm, "");
		stdERR = stdERR.replace(/(\")/gm, '\\"');
        //Build output is always a bare string, so better to enclose it in a string
        stdERR = '"' + stdERR + '"';
    }

    let result = {
    	stdout: testOUT,
    	stderr: stdERR,
    	exitCode: exitCode,
    	log: stdOUT
    }

    callback(null, result);
}

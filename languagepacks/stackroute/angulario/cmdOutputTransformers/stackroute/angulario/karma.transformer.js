const lodash = require('lodash');

function isEmpty (val) {
 return lodash.isEmpty(val) ? true : lodash.isEmpty(val.trim());
}

function tryLookingForError(val) {
	return (!isEmpty(val) && val.indexOf('ERROR [karma]')) ? val.substring(val.indexOf('ERROR [karma]'), val.length) : val;
}

module.exports = function({ exitCode, stdout, stderr, testout } , callback){
	let stdOUT = stdout;
	let stdERR = stderr;
	let transformedOutput = {
    "tests": []
	};

	// converted karma test result from junit to json structure
	// Here transforming that structure into a mocha json structure

	if(!testout|| !testout.testsuite || !testout.testsuite.attributes || !testout.testsuite.testcase > 0){
    stdERR += `[** ERROR **] Unable to parse test output, please check and try, LOG::${ (isEmpty(stderr) ? tryLookingForError(stdout) : stderr) }`;
    callback(null, { exitCode: exitCode, stdout: testout, stderr: stdERR, log: stdout });
    return;
	}
	// for taking the count of test cases
  let totalTestCases = 0;
  let failedCases = 0;

	transformedOutput.stats = testout.testsuite.attributes;

	testout.testsuite.testcase.forEach((suites)=>{
		++totalTestCases;
		let tests = {
			title: suites.attributes.classname,
			fullTitle: suites.attributes.name,
			duration: suites.attributes.time
		}
		if(suites.error){
			testFail = suites.error.forEach((error)=>{
				let failure ={
					message:error.attributes.type,
          type:"error"
				}
				tests.err = failure;
			})
		}
		if(suites.failure){
			++failedCases;
			fails = suites.failure.forEach((failure)=>{
				let error = {
					message: ( (failure.attributes.message) ? (failure.attributes.message + (failure._ || '')) : (failure._ || ' no description found..! ')), //this ensures that no information is ignored, if messages exists, that too is taken along with description
					type: (failure.attributes.type || 'failed')
				}
				tests.err = error;
			})
		}
		transformedOutput.tests.push(tests);
	})

  // instead of taking count from the xml we are taking out by counting errors and total, as parsed XML may not be accurate about these counts
  transformedOutput['summary'] = {
    //"tests": tests.testcase.length,
    "tests": totalTestCases,
    "passed": (totalTestCases - failedCases),
    "failed": failedCases
  }

	testout = JSON.stringify(transformedOutput);

	let result = {
		stdout: testout,
		stderr: stdERR,
		log: stdOUT,
		exitCode: exitCode
	}

	callback(null, result);
};

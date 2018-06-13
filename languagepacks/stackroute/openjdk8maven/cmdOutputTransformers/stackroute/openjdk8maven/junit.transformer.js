module.exports = function({exitCode, stdout, stderr} , callback){
	let stdOUT = stdout;
	let stdERR = stderr;
	let transformedOutput = {};
	let testArray = [];
	let scores = [];

	if(!stdERR) stdERR = "";

	if(!stdOUT || !(Array.isArray(stdOUT)) ) {
		stdERR += "[** ERROR **] Unable to parse output, please check and try...!";
		callback(null, {exitCode, stderr});
		return;
	}

	stdOUT.map((path) =>{
		scores.push(path.testsuite.attributes);
		path.testsuite.testcase.map((suites)=>{
			let tests = {
				title: suites.attributes.classname,
				fullTitle: suites.attributes.name,
				duration: suites.attributes.time
			}

			if(suites.error){
				testFail = suites.error.map((error)=>{
					let failure ={
						message:error.attributes.type,
						type:"error"
					}
					tests.err = failure;
				})
			}

			if(suites.failure){
				fails = suites.failure.map((failure)=>{
					let error = {
						message: failure.attributes.message,
						type: failure.attributes.type
					}
					tests.err = error;
				})
			}

			testArray.push(tests);
			return tests;
		})

	})
	transformedOutput.tests = testArray;
	transformedOutput.stats = scores;

	stdOUT = JSON.stringify(transformedOutput);

	if (stdERR) {
    stdERR = stdERR.replace(/(\r\n|\n|\r|\t)/gm, "");
    stdERR = stdERR.replace(/(\")/gm, '\\"');
    //Build output is always a bare string, so better to enclose it in a string
    stdERR = '"' + stdERR + '"';
  }

	let result = {
		stdout: stdOUT,
		stderr: stdERR,
		exitCode: exitCode
	}

	callback(null, result);
}

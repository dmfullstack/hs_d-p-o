const lodash = require('lodash');

function isEmpty (val) {
 return lodash.isEmpty(val) ? true : lodash.isEmpty(val.trim());
}

module.exports = function({ exitCode, stdout, stderr, testout }, callback) {
  let stdOUT = stdout;
  let stdERR = stderr;
  let testOUT = testout;
  let transformedOutput = {
    "tests": []
  };

  // converted protractor test result from junit to json structure
  // Here transforming that structure into a mocha json structure
  if (!stdERR) stdERR = "";

  if (!testOUT || !testOUT.testsuites || !testOUT.testsuites.testsuite) {
    stdERR += `[** ERROR **] Unable to parse test output, please check and try, LOG::${ (isEmpty(stderr) ? stdout : stderr) }`;
    callback(null, { exitCode: exitCode, stdout: testout, stderr: stdERR, log: stdout });
    return;
  }

  //for counting tests in all testsuites , before it was taking  total testcases from last testSuite
  let totalTestCases = 0;
  let failedCases = 0;

  transformed = testOUT.testsuites.testsuite.map((tests) => {
    if( !tests || !tests.testcase || !tests.testcase > 0){
      stdERR += `[** ERROR **] Unable to parse test output, please check and try, LOG::${ (isEmpty(stderr) ? stdout : stderr) }`;
      callback(null, { exitCode: exitCode, stdout: testout, stderr: stdERR, log: stdout });
      return;
    }

    tests.testcase.forEach((suites) => {
      ++totalTestCases;
      let tests = {
        title: suites.attributes.classname,
        fullTitle: suites.attributes.name,
        duration: suites.attributes.time
      }
      if (suites.error) {
        testFail = suites.error.map((error) => {
          let failure = {
            message: error.attributes.type,
            type: "error"
          }
          tests.err = failure;
        })
      }
      if (suites.failure) {
        // Maintain a count manually, as the parsed XML may not give this count accurately
        ++failedCases;

        fails = suites.failure.map((failure) => {
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
  })

  testOUT = JSON.stringify(transformedOutput);

  let result = {
    stdout: testOUT, //For this command test outputs from report file is the STDOUT
    stderr: stdERR,
    log: stdOUT, //For this command STDOUT is the log
    exitCode: exitCode
  }

  callback(null, result);
}
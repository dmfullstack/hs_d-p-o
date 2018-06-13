const lodash = require('lodash');

function isEmpty (val) {
 return lodash.isEmpty(val) ? true : lodash.isEmpty(val.trim());
}

module.exports = function({ exitCode, stdout, stderr, testout }, callback) {
  let stdOUT = stdout;
  let stdERR = stderr;
  let testOUT = testout;
  let transformedOutput = {};

  // converted protractor test result from junit to json structure
  // Here transforming that structure into a mocha json structure
  if (!stdERR) stdERR = "";

  // testcase outpout from file is found in testOUT
  if (!testOUT || !testOUT.testsuites || !testOUT.testsuites.testsuite) {
    stdERR += `[** ERROR **] Unable to parse test output, please check and try, LOG::${ (isEmpty(stderr) ? stdout : stderr) }`;
    callback(null, { exitCode: exitCode, stdout: testout, stderr: stdERR, log: stdout });
    return;
  }

  //transformedOutput.stats = testOUT.testsuites.testsuite;
  transformed = testOUT.testsuites.testsuite.map((tests) => {

    if (!tests || !tests.testcase || !tests.testcase.length > 0) {
      //stdERR += "[** ERROR **] Unable to parse output, please check and try...!";
      //callback(null, {exitCode: exitCode, stdout: testout, stderr: stderr, log: stdout});
      return;
    }

    let failureCount = 0;
    transformedOutput.tests = tests.testcase.map((suites) => {
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
        ++ failureCount;
        fails = suites.failure.map((failure) => {
          let error = {
            message: ( (failure.attributes.message) ? (failure.attributes.message + (failure._ || '')) : (failure._ || ' no description found..! ')), //this ensures that no information is ignored, if messages exists, that too is taken along with description
            type: (failure.attributes.type || 'failed')
          }
          tests.err = error;
        })
      }
      return tests;
    })
    transformedOutput['summary'] = {
      "total" : tests.testcase.length,
      "passes": tests.testcase.length - failureCount,
      "failures": failureCount
    }
  })

  testOUT = JSON.stringify(transformedOutput);

  let result = {
    stdout: testOUT,
    stderr: stdERR,
    log: stdOUT,
    exitCode: exitCode
  }

  callback(null, result);
}

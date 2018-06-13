module.exports = function(cmd, result, callback) {

  let checks = {
    type: cmd,
    total: 0,
    passes: 0,
    failed: 0,
  };

  let resultObj = {};

  try {
    if (result.stdout)
      resultObj = JSON.parse(result.stdout);
  } catch (err) {
    console.log("Error in parsing result output for protractor check summary ", err);
    resultObj = {};
  }

  if (resultObj && resultObj.summary) {
    checks.total = resultObj.summary.tests;
    checks.passes = resultObj.summary.passed;
    checks.failed = resultObj.summary.failed;

    // Ignoring this, as this was not accurate due to XML parsing
    /*resultObj.stats.map((state) => {
      checks.total = state.attributes.tests
      checks.passes = state.attributes.tests - state.attributes.failures;
      checks.failed = state.attributes.failures;
    })*/
  }

  let summary = { checks };
  result.summary = JSON.stringify(summary);

  callback(null, result);
}
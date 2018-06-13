module.exports = function(cmd, result, callback){

let checks = {
  type: cmd,
  total: 0,
  passes: 0,
  failed: 0,
};

let resultObj = {};

try {
  if(result.stdout)
    resultObj = JSON.parse(result.stdout);
} catch (err) {
  console.log("Error in parsing result output for protractor check summary ", err);
  resultObj = {};
}

 if (resultObj && resultObj.summary) {
    checks.total = resultObj.summary.total;
    checks.passes = resultObj.summary.passes;
    checks.failed = resultObj.summary.failures;
 }

let summary = { checks };
result.summary = JSON.stringify(summary);

callback(null, result);
}

const async = require('async');
const child_process = require('child_process');
const executeCommand = require('../executeCommand');
const parseCommandOutput = require('../parseCommandOutput');
const parseEvaluationChecks = require('../parseEvaluationChecks');

const assert = require('chai').assert;

function dummyUpdateProgress(jobId, stageName, cb) { cb(null, {}); }
function dummySendStageResult(jobId, stageName, prevStageResult, cb) { cb(null, prevStageResult); }

describe('Language pack Test cases', function() {

  this.timeout(15000);

  it('Command::Build without workspace', function(done) {

    let jobId = 111;
    let stageName = 'build-project';
    let cmd = "/stackroute/javascript/build";
    let input = { WORKSPACE: "./" };

    async.waterfall([
      dummyUpdateProgress.bind(null, jobId, stageName),
      executeCommand.bind(null, cmd, input),
      parseCommandOutput.bind(null, cmd),
      parseEvaluationChecks.bind(null, cmd),
      dummySendStageResult.bind(null, jobId, stageName)
    ], (err, result) => {
      if (err) {
        console.log("ERR::", err);
        return done(err);
      }

      console.log("Result ", result);

      assert.equal(result.exitCode, 1, "Exitcode should be 1, as it cannot complete the work");
      assert.equal(result.stdout, "building project in undefined\n", 'STDOUT value will be empty, as nothing runs');
      assert.include(result.stderr, "package.json", 'Error should specify package.json does not exist, hence build cannot happen');

      done();
    });
  });
});
const async = require('async');

const updatePayload = require('./updatePayload');
const updateStage = require('./updateStage');
const retrievePayloadAndStage = require('./retrievePayloadAndStage');
const scheduleJob = require('../../services/job/scheduleJob');

const MAX_STDOUT_SIZE_BYTES = 2000000;
const MAX_STDERR_SIZE_BYTES = 2000000;

module.exports = function({ jobId, stageName, stdout, stderr, exitCode, summary, log }, done) {
  if (!jobId || !stageName) {
    done("Unable to continue processing result, as jobId or stageName is invalid", {jobId, stageName});
    return;
  }

  retrievePayloadAndStage(jobId, stageName, (err, { payload, stage }) => {
    console.log("processing result for stage: ", stageName, " of job ", jobId);

    // If more than 5 MB, don't allow
    if (stdout && stdout.length > MAX_STDOUT_SIZE_BYTES) {
      stdout = "TOO MUCH OF STDOUT, IGNORED";
    }

    if(!log) log = ""; //Log can be undefined, set it to some data, so that further callbacks/bind don't have problem due to its value being undefined
    if (log && log.length > MAX_STDOUT_SIZE_BYTES) {
      stdout = "TOO MUCH OF LOG, IGNORED";
    }

    if (stderr && stderr.length > MAX_STDERR_SIZE_BYTES) {
      stderr = "TOO MUCH OF ERROR LOG, IGNORED";
    }

    if(!stage) {
      done({error: `stage details of stage ${stageName} for job ${jobId} not found..!`});
      return;
    }

    async.parallel([
      updatePayload.bind(null, jobId, stageName, stage, payload, exitCode, stdout, stderr, summary), //LOG is not needed to be in payload, it unnecessary for next processing unit
      updateStage.bind(null, jobId, stageName, stage, exitCode, stdout, stderr, summary, log)
    ], (err, results) => {
      if (err) { done(err); return; }
      scheduleJob(jobId, done);
    });
  });
};
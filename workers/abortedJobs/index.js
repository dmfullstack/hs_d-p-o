const async = require('async');

const sendJobCallback = require('../jobCompletion/sendJobCallback');
const logJobCompletion = require('../jobCompletion/logJobCompletion');
const cleanWorkspace = require('../jobCompletion/cleanWorkspace');
const cleanWorkflowRunTime = require('../jobCompletion/cleanWorkflowRunTime');


module.exports = function({ jobId, errMessage }, done) {
  console.log('ABORTING JOB:', jobId);

  //Remove the job from execution
  //Save the job with status as failed, with the error message for failing
  //Offload the job (context, payload, stages), workspace
  // @TODO trigger a 'job aborted' event

  let status = 'EvalFailed';
  let statusMessage = errMessage || 'Unknown error';

  async.waterfall([
    logJobCompletion.bind(null, jobId, status, statusMessage),
    cleanWorkspace.bind(null, jobId),
    // cleanWorkflowRunTime.bind(null, jobId),
    sendJobCallback.bind(null, jobId)
  ], function(err, results) {
    if (err) {
      console.log("Error in aborting job, ERR: ", err);
    }

    //This by default swallows error, as the expectation is to move the job out of execution/
    //Alternatively we can move the job as unhandled to a separate queue
    done(null);
  });
};
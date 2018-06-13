const async = require('async');

const sendJobCallback = require('./sendJobCallback');
const logJobCompletion = require('./logJobCompletion');
const cleanWorkspace = require('./cleanWorkspace');
const cleanWorkflowRunTime = require('./cleanWorkflowRunTime');

module.exports = function({jobId}, done) {
  console.log('COMPLETING JOB:', jobId);

  try{
      let status = 'EvalCompleted';
      let statusMessage = "Successfully completed";
  	  async.waterfall([
      logJobCompletion.bind(null, jobId, status, statusMessage),
      cleanWorkspace.bind(null, jobId),
      cleanWorkflowRunTime.bind(null, jobId),
      sendJobCallback.bind(null, jobId)
    ], done);
  } catch (err) {
  	console.log('Error in handling completion ', err);
  	done(null);
  }
};

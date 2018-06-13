const async = require('async');
const retrievePayload = require('../../services/payload/retrievePayload');
const completeJob = require('../../services/job/completeJob');

const JOB_STATUSES = ['Completed', 'Failed', 'Blocked'];

module.exports = function(jobId, stages, a, done) {
  const isJobComplete = Object.keys(stages).every((stageName) => {
    let stage = stages[stageName];
    return JOB_STATUSES.indexOf(stage.status) >= 0;
  });

  if(isJobComplete) {
  	console.log('Job completed ', jobId);
    completeJob(jobId, done);
  } else {
    done();
  }
};

const async = require('async');

const removeContext = require('../../services/context/removeContext');
const removePayload = require('../../services/payload/removePayload');
const removeAllStages = require('../../services/stages/removeAllStages');

module.exports = function(jobId, done) {
  console.log('Cleaning workflow runtime for job ', jobId);
  // For the specified jobId, remove workflow data from the runtime
  // Run time is currently are context, payload and stages
  async.parallel([
    removeContext.bind(null, jobId),
    removePayload.bind(null, jobId),
    removeAllStages.bind(null, jobId)
  ], function(err, result){
  	if(err) {
  		console.log('Error in cleaning up workflow runtime for job: ', jobId, ' error: ', err);
  	}
  	done(null);
  });
}

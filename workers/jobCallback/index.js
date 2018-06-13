const async = require('async');
const getJobdata = require('../../services/persistence/getJobdata');
const handleCallback = require('./handleCallback');

module.exports = function({jobId}, done) {
  console.log('Handling calling back for JOB:', jobId);

  try{
  	  async.waterfall([
      getJobdata.bind(null, jobId),
      handleCallback.bind(null, jobId)
    ], done);
  } catch (err) {
  	console.log('Error in handling job callback ', err);
  	done(null);
  }
};

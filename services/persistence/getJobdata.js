const jobsModel = require('./jobs.entity');

const retrieveContext = require('../context/retrieveContext');
const retrievePayload = require('../payload/retrievePayload');
const retrieveAllStages = require('../stages/retrieveAllStages');

module.exports = function(jobId, done) {
  jobsModel.findOne({ jobId: jobId }, function(err, savedJob) {
    if (err) {
      console.log("Error in fetching job ", jobId, " error: ", err);
      return done(err);
    } else {
      return done(null, savedJob);
    }
  });
}

const jobsModel = require('./jobs.entity');


module.exports = function(jobId, { context, payload, stages, status, statusMessage }, done) {
  try {
    // let job = new jobsModel();
    let job = {};
    job.jobId = jobId;
    job.context = context;
    job.payload = payload;
    job.stages = stages;
    job.status = status;
    job.statusMessage = statusMessage;
    job.updatedOn = Date.now();

    let options = {
      new: true, //return the updated document
      upsert: true, //insert if not found/not available already
    }

    jobsModel.findOneAndUpdate({ jobId: jobId }, job, options, function(err, savedJob) {
      if (err) {
        console.log("Error in upsertJobData  for job ", jobId, " ERR: ", err);
        return done(err);
      } else {
        console.log("Saved/Updated in DB for job: ", jobId);
        return done(null, savedJob);
      }
    });
  } catch (err) {
    console.log("Caught exception in save/update of Job entity, ERR: ", err);
    return done(err);
  }
}
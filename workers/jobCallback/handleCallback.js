const request = require('superagent');
const retrievePayload = require('../../services/payload/retrievePayload');
const CALLBACK_MAX_TIMEOUT = 10000;

module.exports = function(jobId, savedJob, done) {
  if (savedJob && savedJob.payload && savedJob.payload.callbackUrl) {
    // console.log('[*-*] Sending data for job: ', jobId, ' result: ', JSON.stringify(savedJob.payload));
    console.log('[*-*] Sending data for job: ', jobId, "callback" , savedJob.payload.callbackUrl);

    //Assuming callback is a POST
    request
    .post(savedJob.payload.callbackUrl)
    .send({ jobId: jobId, completedOn: Date.now() })
      .timeout(CALLBACK_MAX_TIMEOUT) //setting timeout to ensure calling API does not block the further flow
      .end((err, res) => {
        if (err) {
          console.log("Error in calling back on Job Completion ", err);
          //Ignoring the error currently
          return done(null);
        }

        if (res)
          console.log("job completion callback response: ", res.status);

        done(null, savedJob);
      });
    } else {
      console.log("callbackUrl not available to callback for job ", jobId, " with details ", savedJob, " returning without calling back");
      done(null, savedJob);
    }
  }

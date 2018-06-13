const async = require('async');

const retrieveContext = require('../context/retrieveContext');
const retrievePayload = require('../payload/retrievePayload');
const retrieveAllStages = require('../stages/retrieveAllStages');

const upsertJobData = require('./upsertJobData');

module.exports = function(jobId, status, statusMessage, done) {
  async.parallel([
    retrieveContext.bind(null, jobId),
    retrievePayload.bind(null, jobId),
    retrieveAllStages.bind(null, jobId),
  ], function(err, results) {
    if (err) {
      return done(err);
    }

    //Stages is a collection of scheduled stages, hence it has to be converted to a array before persisting
    let stages = [];
    let stagesData = results[2];
    Object.keys(stagesData).forEach((key) => {
      let stageObj = stagesData[key];
      stageObj["name"] = key;
      stages.push(stageObj);
    });

    let job = {
      context: results[0],
      payload: results[1],
      stages: stages,
      status: status,
      statusMessage: statusMessage || ''
    };

    upsertJobData(jobId, job, done);
  });
}
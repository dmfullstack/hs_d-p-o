const express = require('express');
const async = require('async');
const morgan = require('morgan');

const config = require('./config');
const mongoConn = require('./mongoConnection');
const getAmqpConnection = require('./getAmqpConnection');
const bodyParser = require('body-parser');

const generateJobId = require('./services/job/generateJobId');

const registerWorker = require('./registerWorker');
const initializeJob = require('./workers/initializeJob');
const jobScheduler = require('./workers/jobScheduler');
const jobCompletion = require('./workers/jobCompletion');
const stageScheduler = require('./workers/stageScheduler');
const resultsProcessor = require('./workers/resultsProcessor');
const jobCallback = require('./workers/jobCallback');
const abortedJobs = require('./workers/abortedJobs');
const serviceWorkerResults = require('./workers/serviceWorkerResults');

const getJobdata = require('./services/persistence/getJobdata');

registerWorker('qM', initializeJob);
registerWorker('scheduleJob', jobScheduler);
registerWorker('completeJob', jobCompletion);
registerWorker('scheduleStage', stageScheduler);
registerWorker('results', resultsProcessor);
registerWorker('jobCallback', jobCallback);
registerWorker('abortJob', abortedJobs);
registerWorker('serviceWorkers/results', serviceWorkerResults);

const app = express();
app.use(morgan('dev'));

app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({limit:'5mb', extended: true }));

//Initializes mongo connection on mongoose
mongoConn();

app.get('/api/v1/jobs/:jobId', (req, res) => {
  let jobId = req.params.jobId;
  try {
    getJobdata(jobId, (err, jobDoc) => {
      if (err) {
        console.log("Error in getting job document for the external request for job ", jobId, " error: ", err);
        return res.status(500).send({ error: 'Internal error in completing the request..!' });
      }
      let payload = {};
      if(jobDoc && jobDoc.payload && jobDoc.payload.output) {
        payload = jobDoc.payload.output;
      }

      //Returning only the output (job's result), as for an external system, that is what is of interest
      return res.send({ jobId: jobId, payload: payload, status: jobDoc.status, statusMessage: jobDoc.statusMessage });
    });
  } catch (err) {
    console.log("Unexpected error in getting job document for the external request for job  ", jobId, " error: ", err);
    return res.status(500).send({ error: 'Internal exception in completing the request..!' });
  }
});

app.get('/api/v1/jobs/:jobId/stages', (req, res) => {
  let jobId = req.params.jobId;
  try {
    getJobdata(jobId, (err, jobDoc) => {
      if (err) {
        console.log("Error in getting job stages for the external request for job ", jobId, " error: ", err);
        return res.status(500).send({ error: 'Internal error in completing the request..!' });
      }
      let stages = [];
      if(jobDoc) {
        stages = jobDoc.stages;
      }

      return res.send({ jobId: jobId, stages: stages });
    });
  } catch (err) {
    console.log("Unexpected error in getting job stages for the external request for job  ", jobId, " error: ", err);
    return res.status(500).send({ error: 'Internal exception in completing the request..!' });
  }
});

app.post('/api/v1/jobs', (req, res) => {
  // console.log('Payload:', req.body);

  if(!req.body.templateName) {
    res.status(400).send('Request requires templateName');
    return;
  }

  console.log('Request received for evaluation work-flow ',  req.body.templateName, ' for solution: ', req.body.payload.solutionRepoUrl);

  let payload = req.body;
  payload.jobId = generateJobId();

  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    (channel, callback) => {
      channel.assertQueue('qM', { durable: true });
      channel.sendToQueue('qM', new Buffer(JSON.stringify(payload)), null);
      callback();
    }
  ], (err) => {
    if(err) { console.log('ERR: ', err); res.status(500).send({error: 'Could not create job.'}); return; }
    res.send({jobId: payload.jobId});
  });
});

const port = config.PORT || 3000;
app.listen(port, () => {
  console.log('Express server listening on port: ', port);
});

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, channel);
  });
}

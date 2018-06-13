const retrieveContext = require('../../services/context/retrieveContext');
const async = require('async');
const getAmqpConnection = require('../../getAmqpConnection');
const config = require('../../config');

const workerQName = config.SERVICE_WORKER_MQ_UNIX;

module.exports = function(jobId, savedJob, done) {
  // Sends a message to service worker's queue to delete the workspace folder
  let context = JSON.parse(savedJob.context);

  if(!context || !context.WORKSPACE) {
    console.log("No context or WORKSPACE details, hence returning without further action...!");
    return done(null);
  }

  let WORKSPACE = context.WORKSPACE;
  let input = {jobId, WORKSPACE};
  let cmd = "cleanWS";
  let serviceName = "cleanWorkspace";

  return async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    sendMsgToWorker.bind(null, {cmd, serviceName, input})
  ], done);
}

let channel = null;

function getAmqpChannel(connection, callback) {
  if (channel) { callback(null, channel);
    return; }
  connection.createChannel((err, newChannel) => {
    if (err) { callback(err);
      return; }
    channel = newChannel;
    callback(null, channel);
  });
};

function sendMsgToWorker(msg, channel, callback) {
  channel.assertQueue(workerQName, { durable: true });
  channel.sendToQueue(workerQName, new Buffer(JSON.stringify(msg)), { persistent: true });
  callback(null);
};

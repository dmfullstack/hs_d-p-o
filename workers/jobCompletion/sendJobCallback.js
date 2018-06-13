const async = require('async');
const getAmqpConnection = require('../../getAmqpConnection');

module.exports = function(jobId, done) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    completeJob.bind(null, jobId)
  ], done);
};

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, channel);
  });
};

function completeJob(jobId, channel, callback) {
  channel.assertQueue('jobCallback', {durable: true});
  channel.sendToQueue('jobCallback', new Buffer(JSON.stringify({jobId})), {persistent: true});
  callback(null);
};

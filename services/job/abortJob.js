const async = require('async');
const getAmqpConnection = require('../../getAmqpConnection');

module.exports = function(jobId, reason, callback) {
  console.log("Aborting job ", jobId, " due to ", reason);

  if(typeof reason === 'object') {
    reason = JSON.stringify(reason);
  }

  let msgObj = {
    jobId: jobId,
    errMessage: reason
  };

  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    abortJob.bind(null, jobId, msgObj)
  ], callback);
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

function abortJob(jobId, msgObj, channel, callback) {
  channel.assertQueue('abortJob', {durable: true});
  channel.sendToQueue('abortJob', new Buffer(JSON.stringify(msgObj)), {persistent: true});
  callback(null);
};

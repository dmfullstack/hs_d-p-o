const async = require('async');
const getAmqpConnection = require('./getAmqpConnection');
const config = require('./config');

module.exports = function(serviceName, result, done) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    sendServiceResult.bind(null, serviceName, result)
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
}

function sendServiceResult(serviceName, result, channel, callback) {
  result.serviceName = serviceName;
  result.ts_completed = new Date();

  async.series([
    (callback) => { channel.assertQueue(config.SW_RESULT_QUEUE_NAME, {durable: true}, callback); },
    (callback) => { channel.sendToQueue(config.SW_RESULT_QUEUE_NAME, new Buffer(JSON.stringify(result))); callback(); }
  ], callback);
}

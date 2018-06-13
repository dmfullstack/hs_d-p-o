const async = require('async');
const getAmqpConnection = require('./getAmqpConnection');
const abortJob = require('./services/job/abortJob');

module.exports = function(queue, worker) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    (channel, callback) => {
      channel.assertQueue(queue, {durable: true});
      channel.prefetch(1);
      channel.consume(queue, (msgBuffer) => {
        try {
          const msg = JSON.parse(msgBuffer.content.toString());
          worker(msg, (err) => {
            if(err) {
              console.log('Discarding message due to errors in processing:', msgBuffer.content.toString());
              console.error('ERROR :', err);

              // channel.nack(msgBuffer);

              // Instead of nacking the message, which will loop it back for processing, moving it to another queue
              console.error('*** MAY DAY trying to abort job ', msg.jobId);
              abortJob(msg.jobId, err, (abortErr, result) => {
                if(abortErr)
                  console.log("Error in aborting job: ", abortErr, " nor raising further errors..!");

                // Swallow the message, even if aborting failed, as it will make the queue grow
                channel.ack(msgBuffer);
              });
              return;
            }

            channel.ack(msgBuffer);
          });
        } catch(err) {
          console.log('Discarding message:', msgBuffer.content.toString());
          console.error('ERR:', err);
          channel.ack(msgBuffer);
        }
      });
    }
  ]);

  let channel = null;
  function getAmqpChannel(connection, callback) {
    if(channel) { callback(null, channel); return; }
    connection.createChannel((err, newChannel) => {
      if(err) { callback(err); return; }
      channel = newChannel;
      callback(null, channel);
    });
  }
};

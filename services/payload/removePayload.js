const client = require('../../redisClient').duplicate();

module.exports = function(jobId, callback) {
  const payloadKey = jobId + ':payload';

  client.del(payloadKey, callback);
};

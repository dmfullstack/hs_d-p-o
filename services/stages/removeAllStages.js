const client = require('../../redisClient').duplicate();

module.exports = function(jobId, callback) {
  const stagesKey = jobId + ':stages';

  client.del(stagesKey, callback);
};

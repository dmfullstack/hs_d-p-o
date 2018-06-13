const client = require('../../redisClient').duplicate();

module.exports = function(jobId, callback) {
  const contextKey = jobId + ':context';

  client.del(contextKey, callback);
};

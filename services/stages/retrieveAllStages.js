const client = require('../../redisClient').duplicate();

module.exports = function(jobId, callback) {
  const stagesKey = jobId + ':stages';

  client.hgetall(stagesKey, (err, replyMap) => {
    if (err) {
      console.error('Error Retrieving Stages:', err);
      callback(err);
      return;
    }
    const stages = convertHgetReplyToObject(replyMap)
    callback(null, stages);
  });
};

function convertHgetReplyToObject(replyMap) {
  const obj = {};

  if (replyMap) {
    Object.keys(replyMap).forEach((item) => {
      obj[item] = JSON.parse(replyMap[item]);
    });
  }

  return obj;
}
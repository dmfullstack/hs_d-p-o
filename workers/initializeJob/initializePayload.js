const updatePayload = require('../../services/payload/updatePayload');

module.exports = function(jobId, payload, callback) {
  updatePayload(jobId, payload, callback);
};

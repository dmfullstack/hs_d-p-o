const persistJobData = require('../../services/persistence/persistJobData');

module.exports = function(jobId, status, statusMessage, done) {
	persistJobData(jobId, status, statusMessage, done);
}
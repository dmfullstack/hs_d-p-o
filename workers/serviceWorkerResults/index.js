const async = require('async');
const handleServiceResults = require('./handleServiceResults');

module.exports = function(results, done) {
  console.log('RESULTS FROM SERVICE WORKER:', results.serviceName);

  try{
  	  async.parallel([
      handleServiceResults.bind(null, results)
    ], done);
  } catch (err) {
  	console.log('Error in handling service worker completion ', err);
  	done(null);
  }
};

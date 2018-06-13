module.exports = function(results, done) {
	// Just doing the logging, as we are not doing much upon service worker completion
	console.log("Service ", results.serviceName, " completed with results: ", results);
	done(null);
}
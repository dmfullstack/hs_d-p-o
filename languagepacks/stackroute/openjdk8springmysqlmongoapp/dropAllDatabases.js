const async = require('async');
const dropAllMysqlDatabases = require('./dropMysqlDatabases');
const dropAllMongoDatabases = require('./dropMongoDatabases');

//This function will excute drop databases of MYSQL and MONGODB databases parallely
module.exports = function(jobId, input, next){
	async.parallel([
		dropAllMysqlDatabases.bind(null, jobId, input),
		dropAllMongoDatabases.bind(null, jobId, input)
	], (err, result) => {
		if(err){
			console.log(" error in cleaningup databases (MySQL & Mongo)", err);
			return next(err);
		} else {
			console.log('successfully dropped databases', result);
			return next(null, result);
		}
	})
}
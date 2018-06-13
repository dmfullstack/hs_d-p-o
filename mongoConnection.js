const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./applogger');

const setupMongooseConnections = function() {
  mongoose.Promise = global.Promise;

  // mongoose.set('debug', true);

  mongoose.connect(config.MONGO_URL,{useMongoClient: true});

  mongoose.connection.on('connected', function() {
    logger.trace('Mongoose is now connected to ', config.MONGO_URL);
  });

  mongoose.connection.on('error', function(err) {
    logger.error('Error in Mongoose connection: ', err);
  });

  mongoose.connection.on('disconnected', function() {
    logger.trace('Mongoose is now disconnected..!');
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      logger.trace('Mongoose disconnected on process termination');
      process.exit(0);
    });
  });
}

module.exports = setupMongooseConnections;

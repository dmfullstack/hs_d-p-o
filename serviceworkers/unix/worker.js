const async = require('async');
const executeCommand = require('./executeCommand');
const sendServiceResult = require('./sendServiceResult');

module.exports = function({cmd, serviceName, input}, done) {
  async.waterfall([
    executeCommand.bind(null, cmd, input),
    sendServiceResult.bind(null, serviceName)
  ], done);
};

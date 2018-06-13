const async = require('async');
const child_process = require('child_process');
const updateProgress = require('./updateProgress');
const executeCommand = require('./executeCommand');
const parseCommandOutput = require('./parseCommandOutput');
const sendStageResult = require('./sendStageResult');
const parseEvaluationChecks = require('./parseEvaluationChecks');
const transformCommandOutput = require('./transformCommandOutput');
const dropAllDatabases = require('./dropDatabases');
// const createNewDatabase = require('./createNewDatabase');

module.exports = function({jobId, stageName, cmd, input}, done) {
  async.waterfall([
    updateProgress.bind(null, jobId, stageName),
    dropAllDatabases.bind(null, jobId),
    executeCommand.bind(null, cmd, input),
    parseCommandOutput.bind(null, cmd, input),
    transformCommandOutput.bind(null, cmd),
    parseEvaluationChecks.bind(null, cmd),
    // dropAllDatabases.bind(null, jobId),
    sendStageResult.bind(null, jobId, stageName)
  ], done);
};

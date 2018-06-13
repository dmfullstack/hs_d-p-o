const async = require('async');
const child_process = require('child_process');
const updateProgress = require('./updateProgress');
const executeCommand = require('./executeCommand');
const parseCommandOutput = require('./parseCommandOutput');
const sendStageResult = require('./sendStageResult');
const parseEvaluationChecks = require('./parseEvaluationChecks');
const dropAllDatabases = require('./dropAllDatabases');

module.exports = function({jobId, stageName, cmd, input}, done) {
  async.waterfall([
    updateProgress.bind(null, jobId, stageName),
    dropAllDatabases.bind(null, jobId),
    executeCommand.bind(null, cmd, input),
    parseCommandOutput.bind(null, cmd),
    parseEvaluationChecks.bind(null, cmd),
    sendStageResult.bind(null, jobId, stageName),
		dropAllDatabases.bind(null, jobId)
  ], done);
};

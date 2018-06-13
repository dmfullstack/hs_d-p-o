const config = require('./config');
const path = require('path');

module.exports = function(cmd, input, {stdout, stderr, exitCode}, callback) {
  let parser = config.CMD_PREFIX + 'Parsers' + cmd + '.parser';

  console.log('Parsing Output from CMD: ', cmd, ' which exited with status: ', exitCode, ' by ', path.resolve(__dirname, parser));

  let outputParser = require(path.resolve(__dirname, parser));

  outputParser(cmd, input, {stdout, stderr, exitCode}, callback);
};

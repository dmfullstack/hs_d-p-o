const config = require('./config');
const path = require('path');

module.exports = function(cmd, {stdout, stderr, exitCode, testout}, callback) {
  let parser = config.CMD_PREFIX + 'OutputTransformers' + cmd + '.transformer';

  console.log('Transforming Output from CMD: ', cmd, ' which exited with status: ', exitCode, ' by ', path.resolve(__dirname, parser));

  let outputParser = require(path.resolve(__dirname, parser));

  outputParser({exitCode, stdout, stderr, testout}, callback);
};

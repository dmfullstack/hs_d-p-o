const config = require('./config');
const path = require('path');

module.exports = function(cmd, result, callback){
  let parser = config.CMD_PREFIX + 'Checks' + cmd + '.checkParser';

  console.log('Parsing checks from CMD: ', cmd, ' by ', path.resolve(__dirname, parser));

  let checkParser = require(path.resolve(__dirname, parser));

  checkParser(cmd, result, callback);
}

'use strict';

const log4js = require('log4js');
const path = require('path');

console.log('Log path: ', path.resolve('../', 'logs'));

log4js.configure(path.join(__dirname, './log4js.conf.json'), {
  cwd: path.resolve('../', 'logs')
});

const logger = log4js.getLogger('Hobbes-DP');

module.exports = logger;

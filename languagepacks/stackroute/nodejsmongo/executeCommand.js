const child_process = require('child_process');
const config = require('./config');
const _ = require('lodash');
const path = require('path');
const CHILD_PROCESS_MAX_DURATION = 180000;

module.exports = function(cmd, input, iii, callback) {
  cmd = config.CMD_PREFIX + cmd;
  let done = false;

  console.log('Executing CMD: ', path.resolve(__dirname, cmd), 'from : ', __dirname, ' with inputs: ', input);
  let cmdProcess = child_process.spawn(path.resolve(__dirname, cmd),
    {env: _.merge(input, process.env)});

  let stdout = '';
  cmdProcess.stdout.on('data', (data) => {
    console.log(cmd,'STDOUT:', data.toString());
    stdout += data.toString();
  });

  let stderr = '';
  cmdProcess.stderr.on('data', (data) => {
    console.log(cmd,'STDERR:', data.toString());
    stderr += data.toString();
  });

  cmdProcess.on('close', (exitCode) => {
    cmdProcess = null;
    console.log('Process (', cmd, ') closed with code:', exitCode);
    if(!done) {
      done = true;
      callback(null, {stdout, stderr, exitCode});
    }
  });

  cmdProcess.on('exit', (exitCode) => {
    cmdProcess = null;
    console.log('Process (', cmd, ') exited with code:', exitCode);
    if(!done) {
      done = true;
      callback(null, {stdout, stderr, exitCode});
    }
  });

  //Kill the app after specific timeout, as this is not expected run for long time.
  console.log('[', new Date().toISOString(), '] Registering a timeout event for CMD ', cmd);
  setTimeout(() => {
    console.log('[', new Date().toISOString(), '] Checking progress of CMD (', cmd, ') => ', ((cmdProcess)?' STILL RUNNING ':' HAS FINISHED '));
    if(cmdProcess){
      console.log('[', new Date().toISOString(), '] Killing CMD as running for more than MAX duration...!');
      // callback(null, {stdout, stderr, exitCode});
      stderr += '"Process killed/exited, as program took long time complete"';
      cmdProcess.kill('SIGTERM');
      cmdProcess = null;
    }
  }, CHILD_PROCESS_MAX_DURATION);
};

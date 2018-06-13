const executeCommand = require('../executeCommand');
const assert = require('chai').assert;

describe('Test cases for JavaScript Build command', function() {
  it('Command::Build without workspace', function(done) {

    let cmd = "/stackroute/javascript/build";
    let prevStageResult = {};

    // Don't mention workspace folder
    let input = { WORKSPACE: undefined };

    executeCommand(cmd, input, prevStageResult, (err, result) => {
      //Test build command
      if (err) {
        console.log("ERR::", err);
        return done(err);
      }

      console.log("Result ", result);

      //Asserts to check if the build command executed as expected
      // stdout, stderr, exitCode
      assert.equal(result.exitCode, 1, "Exitcode should be 1, as it cannot complete the work");
      assert.equal(result.stdout, "building project in undefined\n", 'STDOUT value will be empty, as nothing runs');
      assert.include(result.stderr, "No such file or directory", 'As workspace was not mentioned, error should mention about it');

      done();
    });
  });

  it('Command::Build with a workspace folder exist, but no code in it', function(done) {
    let cmd = "/stackroute/javascript/build";
    let prevStageResult = {};

    // Try to execute yarn or npm install in the folder, which does not have package.json
    let input = { WORKSPACE: __dirname };

    executeCommand(cmd, input, prevStageResult, (err, result) => {
      //Test build command
      if (err) {
        console.log("ERR::", err);
        return done(err);
      }

      console.log("Result ", result);

      //Asserts to check if the build command executed as expected
      // stdout, stderr, exitCode
      assert.equal(result.exitCode, 1, "Exitcode should be 1, as it cannot complete the work");
      assert.equal(result.stdout, "building project in \n", 'command tries to build inside the specified folder');
      assert.include(result.stderr, "No such file or directory", 'As workspace was not mentioned, error should mention about it');

      done();
    });
  });
});
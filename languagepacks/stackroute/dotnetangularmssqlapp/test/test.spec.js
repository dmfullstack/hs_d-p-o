const executeCommand = require('../executeCommand');
const assert = require('chai').assert;

describe('Test cases for Dotnet test command', function() {
  it('Command::testing without workspace', function(done) {

    let prevStageResult = {};

    // Don't mention workspace folder
    let input = { WORKSPACE: undefined };

    let cmd = "/stackroute/dotnet/test";

    executeCommand(cmd, input, prevStageResult, (err, result) => {
      //Test restore command
      if (err) {
        console.log("ERR::", err);
        return done(err);
      }

      console.log("Result ", result);

      //Asserts to check if the restire command executed as expected
      // stdout, stderr, exitCode
      assert.equal(result.exitCode, 2, "Exitcode should be 2, as it cannot complete the work");
      assert.equal(result.stdout, "running tests of the project in undefined\n", 'STDOUT value will be empty, as nothing runs');
      assert.include(result.stderr, "can\'t cd to undefined\n", 'As workspace was not mentioned, error should mention about it');

      done();
    });
  });

  it('Command::Test with a workspace folder exist, with code inside dotnet_calculator/TestxUnit', function(done) {
    this.timeout(9000);


    let cmd = "/stackroute/dotnet/test";
    let cloneCmd = "git clone https://gitlab-dev.stackroute.in/surya/dotnet_calculator.git"

    let prevStageResult = {};



    let input = { WORKSPACE: 'dotnet_calculator/TestxUnit' };
    // Try to execute yarn or npm install in the folder, which does not have package.json
    // let input = { WORKSPACE: 'dotnet_calculator/TestxUnit' };

    executeCommand(cmd, input, prevStageResult, (err, result) => {
      //Test restore command
      if (err) {
        console.log("ERR::", err);
        return done(err);
      }

      console.log("Result ", result);

      //Asserts to check if the restore command executed as expected
      // stdout, stderr, exitCode
      assert.equal(result.exitCode, 0, "Exitcode should be 0, because it completes the work");
      assert.include(result.stdout, "running tests of the project in dotnet_calculator/TestxUnit\n", 'command tries to test inside the specified folder');
      assert.include(result.stdout, "Build completed.", 'The command builds the test cases before it runs the tests');
      assert.include(result.stdout, "Total tests: 4. Passed: 4. Failed: 0. Skipped: 0", 'command tries to restore inside the specified folder');
      assert.include(result.stderr, '', 'As there should be no error after testing');
      done();
    });
  });

  it('Command::Test with a workspace folder exist, with code inside CsvToJson', function(done) {
    this.timeout(9000);
    let cmd = "/stackroute/dotnet/test";
    let prevStageResult = {};

    // Try to execute yarn or npm install in the folder, which does not have package.json
    let input = { WORKSPACE: 'CsvToJson' };

    executeCommand(cmd, input, prevStageResult, (err, result) => {
      //Test restore command
      if (err) {
        console.log("ERR::", err);
        return done(err);
      }

      console.log("Result ", result);

      //Asserts to check if the restore command executed as expected
      // stdout, stderr, exitCode
      assert.equal(result.exitCode, 1, "Exitcode should be 1, because it completes the work");
      assert.include(result.stdout, "running tests of the project in CsvToJson", 'command tries to test inside the specified folder');
      assert.include(result.stdout, "Build completed.", 'The command builds the test cases before it runs the tests');
      assert.include(result.stdout, "Starting test execution, please wait", "Test cases started running");
      assert.include(result.stdout, "Total tests: 1. Passed: 1. Failed: 0. Skipped: 0", 'command tries to restore inside the specified folder');
      assert.include(result.stderr, '', 'As there should be no error after testing');
      done();
    });
  });
});

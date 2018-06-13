const executeCommand = require('../executeCommand');
const assert = require('chai').assert;

describe('Test cases for dotnet Build command', function() {
  it('Command::Build without workspace', function(done) {

    let cmd = "/stackroute/dotnet/build";
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
      assert.equal(result.exitCode, 2, "Exitcode should be 2, as it cannot complete the work");
      assert.equal(result.stdout, "building project in undefined\n", 'STDOUT value will be empty, as nothing runs');
      assert.include(result.stderr, "can\'t cd to undefined\n", 'As workspace was not mentioned, error should mention about it');

      done();
    });
  });

  it('Command::Build with a workspace folder exist, with code inside it for dotnet_calculator/ConsoleApp', function(done) {
    this.timeout(4000);
    let cmd = "/stackroute/dotnet/build";
    let prevStageResult = {};

    // Try to execute yarn or npm install in the folder, which does not have package.json
    let input = { WORKSPACE: 'dotnet_calculator/ConsoleApp' };

    executeCommand(cmd, input, prevStageResult, (err, result) => {
      //Test build command
      if (err) {
        console.log("ERR::", err);
        return done(err);
      }

      console.log("Result ", result);

      //Asserts to check if the build command executed as expected
      // stdout, stderr, exitCode
      assert.equal(result.exitCode, 0, "Exitcode should be 0, as it cannot complete the work");
      assert.include(result.stdout, "building project in dotnet_calculator/ConsoleApp", 'command tries to build inside the specified folder');
      assert.include(result.stdout, "0 Error(s)", 'should have zero errors to be successful');
      assert.include(result.stdout, "0 Warning(s)", 'should have zero errors to be successful');
      assert.equal(result.stderr, '', 'As there should be no error after restoring the project');
      done();
    });
  });

  it('Command::Build with a workspace folder exist, with code inside it for CsvToJson', function(done) {
    this.timeout(8000);
    let cmd = "/stackroute/dotnet/build";
    let prevStageResult = {};

    // Try to execute yarn or npm install in the folder, which does not have package.json
    let input = { WORKSPACE: 'CsvToJson' };

    executeCommand(cmd, input, prevStageResult, (err, result) => {
      //Test build command
      if (err) {
        console.log("ERR::", err);
        return done(err);
      }

      console.log("Result ", result);

      //Asserts to check if the build command executed as expected
      // stdout, stderr, exitCode
      assert.equal(result.exitCode, 0, "Exitcode should be 0, as it cannot complete the work");
      assert.include(result.stdout, "building project in CsvToJson", 'command tries to build inside the specified folder');
      assert.include(result.stdout, "0 Error(s)", 'should have zero errors to be successful');
      assert.include(result.stdout, "0 Warning(s)", 'should have zero errors to be successful');
      assert.equal(result.stderr, '', 'As there should be no error after restoring the project');
      done();
    });
  });
});

const executeCommand = require('../executeCommand');
const assert = require('chai').assert;

describe('Test cases for dotnet Restore command', function() {
  it('Command::Restore without workspace', function(done) {

    let cmd = "/stackroute/dotnet/restore";
    let prevStageResult = {};

    // Don't mention workspace folder
    let input = { WORKSPACE: undefined };

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
      assert.equal(result.stdout, "restoring project in undefined\n", 'STDOUT value will be empty, as nothing runs');
      assert.include(result.stderr, "can\'t cd to undefined\n", 'As workspace was not mentioned, error should mention about it');

      done();
    });
  });

  it('Command::Restore with a workspace folder exist, with code inside it dotnet_calculator/ConsoleApp', function(done) {

    let cmd = "/stackroute/dotnet/restore";
    let prevStageResult = {};

    // Try to execute yarn or npm install in the folder, which does not have package.json
    let input = { WORKSPACE: 'dotnet_calculator/ConsoleApp' };

    executeCommand(cmd, input, prevStageResult, (err, result) => {
      //Test restore command
      if (err) {
        console.log("ERR::", err);
        return done(err);
      }

      console.log("Result ", result);

      //Asserts to check if the restore command executed as expected
      // stdout, stderr, exitCode
      assert.equal(result.exitCode, 0, "Exitcode should be 0, as it cannot complete the work");
      assert.include(result.stdout, "restoring project in dotnet_calculator/ConsoleApp", 'command tries to restore inside the specified folder');
      assert.include(result.stderr, '', 'As there should be no error after restoring the project');

      done();
    });
  });

  it('Command::Restore with a workspace folder exist, with code inside it CsvToJson', function(done) {

    let cmd = "/stackroute/dotnet/restore";
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
      assert.equal(result.exitCode, 0, "Exitcode should be 0, as it cannot complete the work");
      assert.include(result.stdout, "restoring project in CsvToJson", 'command tries to restore inside the specified folder');
      assert.include(result.stderr, '', 'As there should be no error after restoring the project');

      done();
    });
  });
});

const fs = require("fs");
const xml2js = require("xml2js");
const glob = require("glob");
const async = require("async");
const path = require('path');

function convertJunitXmlToJson(fileContents, done) {
  let optionForparser = {
    attrkey: 'attributes',
    trim: true,
    normalize: true
  };

  let parser = new xml2js.Parser(optionForparser);
  parser.parseString(fileContents, (err, parsedOutput) => {
    if (err) {
      console.log("error in conveting Xml to Json ", err);
      //Ignore error, and use whatever the content in the file
      done(null, fileContents);
      return;
    }
    done(null, parsedOutput);
  });
}

function parseJunitResult(junitOutputFile, result, done) {
  async.waterfall([
    fs.readFile.bind(null, junitOutputFile),
    convertJunitXmlToJson
  ], (err, testout) => {
    result['testout'] = testout;
    console.log("Finished parsing test results from ", junitOutputFile);
    done(null, result);
  });
}

module.exports = function(cmd, input, { exitCode, stdout, stderr }, callback) {
  let stdOUT = stdout;
  let stdERR = stderr;

  if (stdOUT) {
    stdOUT = stdOUT.replace(/(\r\n|\n|\r|\t)/gm, "");
    stdOUT = stdOUT.replace(/(\")/gm, '\\"');
    //Build output is always a bare string, so better to enclose it in a string
    stdOUT = '"' + stdOUT + '"';
  }

  if (stdERR) {
    stdERR = stdERR.replace(/(\r\n|\n|\r|\t)/gm, "");
    stdERR = stdERR.replace(/(\")/gm, '\\"');
    //Build error is always a bare string, so better to enclose it in a string
    stdERR = '"' + stdERR + '"';
  }

  let result = {
    stdout: stdOUT,
    stderr: stdERR,
    testout: undefined, //Want to retain STDOUT, hence test cases output from test report files goes into this property of result object
    exitCode: exitCode
  }

  // console.log("the file path",input.TEST_FILE_PATTERN);
  // Krama test results writes into a junit file .
  // TEST_OUTPUT_FILE_PATTERN is regexp to pic that file and convet to json structure

  let matchesArray = glob.sync(input.TEST_OUTPUT_FILE_PATTERN, {
    cwd: input.WORKSPACE,
    dot: false,
    nocase: true,
    ignore: input.IGNORE_FILE_PATTERN
  });
  console.log("Glob returned result for pattern search ", matchesArray);

  if (matchesArray.length > 0) {
    let absolutePath = path.resolve(input.WORKSPACE, matchesArray[0]);
    console.log("Parsing test results from ", absolutePath);
    parseJunitResult(absolutePath, result, callback);
  } else {
    callback(null, result);
  }
};
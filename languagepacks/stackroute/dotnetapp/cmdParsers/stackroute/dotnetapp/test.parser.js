const fs = require("fs");
const xml2js = require("xml2js");
const glob = require("glob");
const async = require("async");
const path = require('path');

function convertTrxToJson(fileContents, done) {
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

/**

 * an array of xml reports are expected as there might be multiple reports coming from

 * participant or evaluation testcases which have sub modules

**/

function arrayOfXmlReports(trxOutputFile, done){
  async.waterfall([
    fs.readFile.bind(null, trxOutputFile),
    convertTrxToJson
  ], (err, result) => {
    done(null, result);
  });
}

/**

 * the Junitoutput files are sent through an array (trxOutputFile)

 * arrayOfXmlReports is the function which uses async.waterfall to convert reports from xml to json

**/

function parseJunitResult(trxOutputFile, result, done) {
  async.map(trxOutputFile, arrayOfXmlReports, function(err, stdOUT){
    if(err) {
      done(err)
      return;
    }
    result['testout'] = stdOUT;
    done(null, result);
  })
}

module.exports = function(cmd, input, { exitCode, stdout, stderr }, callback) {
  let stdOUT = stdout;
  let stdERR = stderr;

  let result = {
    stdout: stdOUT,
    stderr: stdERR,
    exitCode: exitCode,
    testout : undefined
  }
  // console.log("the file path",input.TEST_FILE_PATTERN);
  // Can we read the pom.xml of submission, in which there will be the Artifact name, pick it and construct TEST report on that basis
  // Or in the pom.xml, if there is a configuration for TEST output file name and
  let matchesArray = glob.sync(input.REPORT_OUTPUT_FILE, {
    cwd: input.WORKSPACE,
    dot: false,
    nocase: true
    // ignore: input.IGNORE_FILE_PATTERN
  });
  console.log("Glob returned result for pattern search ", matchesArray);

  if(matchesArray.length > 0){
    let absolutePath =  matchesArray.map(function(e){
      return path.resolve(input.WORKSPACE, e);
    })
    parseJunitResult(absolutePath, result, callback);
  } else {
    callback(null, result);
  }
};

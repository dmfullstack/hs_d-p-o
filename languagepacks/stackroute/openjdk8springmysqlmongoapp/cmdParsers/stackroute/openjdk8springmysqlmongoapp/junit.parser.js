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

/**

 * an array of xml reports are expected as there might be multiple reports coming from

 * participant or evaluation testcases which have sub modules

**/
function arrayOfXmlReports(junitOutputFile, done){
  async.waterfall([
    fs.readFile.bind(null, junitOutputFile),
    convertJunitXmlToJson
  ], (err, result) => {
    done(null, result);
  });
}

/**

 * the Junitoutput files are sent through an array (junitOutputFile)

 * arrayOfXmlReports is the function which uses async.waterfall to convert reports from xml to json

**/
function parseJunitResult(junitOutputFile, result, done) {
  async.map(junitOutputFile, arrayOfXmlReports, function(err, stdOUT){
    if(err) {
      done(err)
      return;
    }

    result.stdout = stdOUT;
    done(null, result);
  })
}

module.exports = function(cmd, input, { exitCode, stdout, stderr }, callback) {
  let stdOUT = stdout;
  let stdERR = stderr;

  let result = {
    stdout: stdOUT,
    stderr: stdERR,
    exitCode: exitCode
  }
  // console.log("the file path",input.TEST_FILE_PATTERN);
  //Can we read the pom.xml of submission, in swhich there will be the Artifact name, pick it and construct TEST report on that basis
  //Or in the pom.xml, if there is a configuration for TEST output file name and
  let matchesArray = glob.sync(input.TEST_OUTPUT_FILE_PATTERN, {
    cwd: input.WORKSPACE,
    dot: false,
    nocase: true,
    ignore: input.IGNORE_FILE_PATTERN
  });
  console.log("Glob returned result for pattern search ", matchesArray);

  if(matchesArray.length > 0){
    let absolutePath =  matchesArray.map(function(pathToPatch){
      return path.resolve(input.WORKSPACE, pathToPatch);
    })
    parseJunitResult(absolutePath, result, callback);
  }
  else {
    callback(null, result);
  }
};
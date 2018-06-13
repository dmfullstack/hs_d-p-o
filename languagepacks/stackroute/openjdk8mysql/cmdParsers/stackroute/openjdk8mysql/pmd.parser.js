const fs = require("fs");
const xml2js = require("xml2js");
const glob = require("glob");
const async = require("async");
const path = require('path');

function convertPmdXmlToJson(fileContents, done) {
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

function parsePmdResult(pmdOutputFile, result, done) {
  async.waterfall([
    fs.readFile.bind(null, pmdOutputFile),
    convertPmdXmlToJson
  ], (err, stdOUT) => {
    result.stdout = stdOUT;
    done(null, result);
  });
}

module.exports = function(cmd, input, { exitCode, stdout, stderr }, callback) {
  let stdOUT = stdout;
  let stdERR = stderr;

  let result = {
    stdout: stdOUT,
    stderr: stdERR,
    exitCode: exitCode
  }

  let matchesArray = glob.sync(input.REPORT_OUTPUT_FILE, {
    cwd: input.WORKSPACE,
    dot: false,
    nocase: true,
  });

  console.log("Glob returned result for pattern search ", matchesArray);

  if(matchesArray.length > 0) {
    let absolutePath = path.resolve(input.WORKSPACE, matchesArray[0]);
    // let absolutePath = input.WORKSPACE + '/' + matchesArray;

    console.log("Reading PMD result from ", absolutePath);

    parsePmdResult(absolutePath, result, callback);
  } else {
    callback(null, result);
  }
};
